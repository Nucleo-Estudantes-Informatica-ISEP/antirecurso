import type { NextAuthOptions, Profile } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import ZitadelProvider from 'next-auth/providers/zitadel';

type ZitadelProfile = Profile & {
  email_verified?: boolean;
};

const authDebugEnabled = process.env.AUTH_DEBUG === 'true';

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

async function refreshAccessToken(token: JWT): Promise<JWT> {
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

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    if (authDebugEnabled) {
      console.info('[auth][jwt] Access token refreshed successfully.');
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpiresAt: refreshedTokens.expires_in
        ? Date.now() + refreshedTokens.expires_in * 1000
        : undefined,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      idToken: refreshedTokens.id_token ?? token.idToken,
      error: undefined
    };
  } catch (error) {
    if (authDebugEnabled) {
      console.error('[auth][jwt] Failed to refresh access token:', error);
    }
    return {
      ...token,
      error: 'AccessTokenExpired'
    };
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
    async signIn({ profile }) {
      const zitadelProfile = profile as ZitadelProfile | undefined;
      return zitadelProfile?.email_verified !== false;
    },
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.accessTokenExpiresAt = account.expires_at ? account.expires_at * 1000 : undefined;
        token.idToken = account.id_token;
        token.refreshToken = account.refresh_token;

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

      // Check if access token is expired
      const isExpired =
        typeof token.accessTokenExpiresAt === 'number' &&
        Number.isFinite(token.accessTokenExpiresAt) &&
        Date.now() >= token.accessTokenExpiresAt;

      if (isExpired) {
        if (token.refreshToken) {
          return await refreshAccessToken(token);
        }
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
      }

      session.error = token.error;

      return session;
    }
  }
};
