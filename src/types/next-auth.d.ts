import type { DefaultSession } from 'next-auth';
import type { JWT as DefaultJWT } from 'next-auth/jwt';
import type { AuthNeiRole } from '@/lib/auth-nei-roles';

declare module 'next-auth' {
  interface Session {
    error?: 'AccessTokenExpired';
    user?: DefaultSession['user'] & {
      id?: string;
      roles: AuthNeiRole[];
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    accessToken?: string;
    accessTokenExpiresAt?: number;
    authNeiRoles?: AuthNeiRole[];
    error?: 'AccessTokenExpired';
    idToken?: string;
    refreshToken?: string;
    userEmail?: string;
    userName?: string;
  }
}
