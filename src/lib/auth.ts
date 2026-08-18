import type { NextAuthOptions, Profile } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import ZitadelProvider from 'next-auth/providers/zitadel';
import { getAuthNeiRoles, getAuthNeiRolesFromJwt } from '@/lib/auth-nei-roles';
import { fetchAuthNeiRolesFromUserInfo } from '@/lib/zitadel-userinfo';
import { shouldRefreshAccessToken } from './token-lifetime';

type ZitadelProfile = Profile & {
  email_verified?: boolean;
};

const authDebugEnabled = process.env.AUTH_DEBUG === 'true';
const refreshRequests = new Map<string, Promise<JWT>>();

const requiredEnv = {
  authClientId: process.env.AUTH_CLIENT_ID ?? '',
  authIssuerUrl: process.env.AUTH_ISSUER_URL ?? ''
};

const zitadelProviderConfig: Parameters<typeof ZitadelProvider>[0] = {
  clientId: requiredEnv.authClientId,
  issuer: requiredEnv.authIssuerUrl,
  clientSecret: process.env.AUTH_CLIENT_SECRET ?? '',
  authorization: {
    params: {
      scope: process.env.AUTH_SCOPES ?? 'openid email profile offline_access'
    }
  }
};

async function requestRefreshedAccessToken(token: JWT): Promise<JWT> {
  try {
    if (authDebugEnabled) {
      console.info('[auth][jwt] Attempting to refresh access token...');
    }

    const response = await fetch(`${requiredEnv.authIssuerUrl}/oauth/v2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: requiredEnv.authClientId,
        client_secret: process.env.AUTH_CLIENT_SECRET ?? '',
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken ?? ''
      })
    });

    const refreshedTokens = (await response.json()) as Record<string, unknown>;

    if (!response.ok) {
      throw new Error(`Token endpoint returned HTTP ${response.status}`);
    }

    const refreshedAccessToken = refreshedTokens.access_token;
    const expiresIn = Number(refreshedTokens.expires_in);

    if (
      typeof refreshedAccessToken !== 'string' ||
      refreshedAccessToken.length === 0 ||
      !Number.isFinite(expiresIn) ||
      expiresIn <= 0
    ) {
      throw new Error('ZITADEL refresh response is missing a valid access token or expiry.');
    }

    // Re-read userinfo with the newly issued provider token instead of assuming
    // the refreshed JWT always carries role assertions. This keeps app-specific
    // authorization current while the single-flight refresh prevents concurrent
    // requests from racing a rotating refresh token.
    const refreshedRoles = await fetchAuthNeiRolesFromUserInfo({
      issuer: requiredEnv.authIssuerUrl,
      accessToken: refreshedAccessToken
    });

    if (authDebugEnabled) {
      console.info('[auth][jwt] Access token refreshed and AuthNEI roles revalidated.');
    }

    return {
      ...token,
      accessToken: refreshedAccessToken,
      accessTokenExpiresAt: Date.now() + expiresIn * 1000,
      refreshToken:
        typeof refreshedTokens.refresh_token === 'string'
          ? refreshedTokens.refresh_token
          : token.refreshToken,
      idToken:
        typeof refreshedTokens.id_token === 'string' ? refreshedTokens.id_token : token.idToken,
      authNeiRoles: refreshedRoles,
      error: undefined
    };
  } catch (error) {
    if (authDebugEnabled) {
      console.error('[auth][jwt] Failed to refresh access token:', error);
    }

    return {
      ...token,
      authNeiRoles: [],
      error: 'AccessTokenExpired'
    };
  }
}

export async function refreshAccessToken(token: JWT): Promise<JWT> {
  if (!token.refreshToken) {
    return {
      ...token,
      authNeiRoles: [],
      error: 'AccessTokenExpired'
    };
  }

  const existingRequest = refreshRequests.get(token.refreshToken);
  if (existingRequest) return existingRequest;

  const refreshRequest = requestRefreshedAccessToken(token);
  refreshRequests.set(token.refreshToken, refreshRequest);

  try {
    return await refreshRequest;
  } finally {
    if (refreshRequests.get(token.refreshToken) === refreshRequest) {
      refreshRequests.delete(token.refreshToken);
    }
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/login'
  },
  providers: [ZitadelProvider(zitadelProviderConfig)],
  callbacks: {
    async signIn({ profile, account }) {
      const zitadelProfile = profile as ZitadelProfile | undefined;
      // Legacy email linking requires affirmative IdP verification. A missing optional
      // OIDC claim is denied instead of weakening the account-link boundary.
      if (zitadelProfile?.email_verified !== true) return false;

      const subject =
        (typeof profile?.sub === 'string' ? profile.sub : undefined) ?? account?.providerAccountId;

      return Boolean(subject);
    },
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.accessTokenExpiresAt = account.expires_at ? account.expires_at * 1000 : undefined;
        token.idToken = account.id_token;
        token.refreshToken = account.refresh_token;
        const profileRoles = getAuthNeiRoles(profile as Record<string, unknown> | undefined);
        const accessTokenRoles = getAuthNeiRolesFromJwt(account.access_token);
        token.authNeiRoles = profileRoles.length ? profileRoles : accessTokenRoles;

        if (authDebugEnabled) {
          console.info('[auth][jwt]', {
            phase: 'account-received',
            provider: account.provider,
            hasAccessToken: typeof account.access_token === 'string',
            hasIdToken: typeof account.id_token === 'string',
            hasRefreshToken: typeof account.refresh_token === 'string',
            expiresAt: account.expires_at ?? null
          });
        }
      }

      token.userEmail =
        (typeof profile?.email === 'string' ? profile.email : undefined) ?? token.userEmail;
      token.userName =
        (typeof profile?.name === 'string' ? profile.name : undefined) ?? token.userName;

      const isExpired = shouldRefreshAccessToken(token.accessTokenExpiresAt);

      if (isExpired) {
        if (token.refreshToken) {
          return await refreshAccessToken(token);
        }
        token.authNeiRoles = [];
        token.error = 'AccessTokenExpired';
      } else {
        delete token.error;
      }

      if (authDebugEnabled) {
        console.info('[auth][jwt]', {
          phase: 'token-returned',
          hasAccessToken: typeof token.accessToken === 'string',
          hasIdToken: typeof token.idToken === 'string',
          hasRefreshToken: typeof token.refreshToken === 'string',
          hasUserEmail: typeof token.userEmail === 'string',
          hasUserName: typeof token.userName === 'string',
          error: token.error ?? null,
          accessTokenExpiresAt:
            typeof token.accessTokenExpiresAt === 'number' ? token.accessTokenExpiresAt : null
        });
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.sub === 'string' ? token.sub : undefined;
        session.user.email =
          typeof token.userEmail === 'string' ? token.userEmail : session.user.email;
        session.user.name = typeof token.userName === 'string' ? token.userName : session.user.name;
        session.user.roles = token.error ? [] : (token.authNeiRoles ?? []);
      }

      session.error = token.error;

      return session;
    }
  }
};
