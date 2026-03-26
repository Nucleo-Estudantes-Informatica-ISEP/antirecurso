import type { DefaultSession } from 'next-auth';
import type { JWT as DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    error?: 'AccessTokenExpired';
    user?: DefaultSession['user'] & {
      id?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    accessToken?: string;
    accessTokenExpiresAt?: number;
    error?: 'AccessTokenExpired';
    idToken?: string;
    userEmail?: string;
    userName?: string;
  }
}
