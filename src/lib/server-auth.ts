import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import { authOptions, refreshAccessToken } from '@/lib/auth';
import {
  buildSessionCookieUpdates,
  getSessionCookieConfig,
  readSessionToken
} from '@/lib/session-cookie';
import { shouldRefreshAccessToken } from '@/lib/token-lifetime';

export const CLIENT_SESSION_TOKEN = 'server-session';
const authDebugEnabled = process.env.AUTH_DEBUG === 'true';
const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

export async function getAppAuthSession() {
  return getServerSession(authOptions);
}

export async function getApiAccessToken() {
  const jwtSession = await getJwtSessionFromCookies();
  const token = jwtSession?.token;

  if (!token || !jwtSession) {
    return null;
  }

  if (isAccessTokenExpired(token)) {
    if (token.refreshToken) {
      const secret = process.env.AUTH_SECRET;
      if (!secret) return null;

      if (authDebugEnabled) {
        console.info('[auth][token] Access token expired, attempting to refresh...');
      }
      const refreshedToken = await refreshAccessToken(token);
      if (
        refreshedToken &&
        refreshedToken.accessToken &&
        refreshedToken.error !== 'AccessTokenExpired'
      ) {
        try {
          const { encode } = await import('next-auth/jwt');
          const encodedToken = await encode({
            token: refreshedToken,
            secret,
            maxAge: SESSION_MAX_AGE_SECONDS
          });
          await writeSessionCookie(jwtSession, encodedToken);

          if (authDebugEnabled) {
            console.info('[auth][token] Successfully updated session cookie with refreshed token.');
          }
        } catch (error) {
          if (authDebugEnabled) {
            console.warn(
              '[auth][token] Failed to write refreshed token to cookies (expected in Server Components):',
              error
            );
          }
        }
        return refreshedToken.accessToken;
      }
    }
    return null;
  }

  return typeof token.accessToken === 'string' ? token.accessToken : null;
}

type JwtSession = {
  token: JWT;
  cookieName: string;
  secureCookie: boolean;
  existingCookieNames: string[];
};

async function getJwtSessionFromCookies(): Promise<JwtSession | null> {
  const allCookies = (await cookies()).getAll();
  const token = await readSessionToken(allCookies);
  if (!token) return null;

  return {
    ...getSessionCookieConfig(),
    token,
    existingCookieNames: allCookies.map(({ name }) => name)
  };
}

export function isAccessTokenExpired(token: JWT | null) {
  if (!token || typeof token.accessToken !== 'string') {
    return true;
  }

  if (token.error === 'AccessTokenExpired') {
    return true;
  }

  if (shouldRefreshAccessToken(token.accessTokenExpiresAt)) {
    return true;
  }

  return false;
}

async function writeSessionCookie(session: JwtSession, encodedToken: string) {
  const cookieStore = await cookies();
  const updates = buildSessionCookieUpdates(
    session.existingCookieNames,
    session.cookieName,
    encodedToken,
    SESSION_MAX_AGE_SECONDS
  );

  for (const update of updates) {
    cookieStore.set(update.name, update.value, {
      path: '/',
      httpOnly: true,
      secure: session.secureCookie,
      sameSite: 'lax',
      maxAge: update.maxAge
    });
  }
}
