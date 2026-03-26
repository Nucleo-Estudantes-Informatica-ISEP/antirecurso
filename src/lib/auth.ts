import type { NextAuthOptions, Profile } from 'next-auth';
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
      scope: process.env.AUTH_SCOPES ?? 'openid email profile'
    }
  }
};

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

        if (authDebugEnabled) {
          console.info('[auth][jwt]', {
            phase: 'account-received',
            provider: account.provider,
            hasAccessToken: typeof account.access_token === 'string',
            hasIdToken: typeof account.id_token === 'string',
            expiresAt: account.expires_at ?? null
          });
        }
      }

      token.userEmail =
        (typeof profile?.email === 'string' ? profile.email : undefined) ?? token.userEmail;
      token.userName =
        (typeof profile?.name === 'string' ? profile.name : undefined) ?? token.userName;

      if (
        typeof token.accessTokenExpiresAt === 'number' &&
        Number.isFinite(token.accessTokenExpiresAt) &&
        Date.now() >= token.accessTokenExpiresAt
      ) {
        token.error = 'AccessTokenExpired';
      } else {
        delete token.error;
      }

      if (authDebugEnabled) {
        console.info('[auth][jwt]', {
          phase: 'token-returned',
          hasAccessToken: typeof token.accessToken === 'string',
          hasIdToken: typeof token.idToken === 'string',
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
