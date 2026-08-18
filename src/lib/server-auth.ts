import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import type { JWT } from 'next-auth/jwt';
import { authOptions, refreshAccessToken } from '@/lib/auth';
import { buildSessionCookieUpdates } from '@/lib/session-cookie';
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

export async function getIdToken() {
  const token = await getJwtTokenFromCookies();

  if (!token) {
    return null;
  }

  return typeof token.idToken === 'string' ? token.idToken : null;
}

export async function getJwtTokenFromCookies() {
  return (await getJwtSessionFromCookies())?.token ?? null;
}

type JwtSession = {
  token: JWT;
  cookieName: string;
  secureCookie: boolean;
  existingCookieNames: string[];
};

async function getJwtSessionFromCookies(): Promise<JwtSession | null> {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  if (!allCookies.length) {
    if (authDebugEnabled) {
      console.warn('[auth][token]', {
        source: 'getJwtTokenFromCookies',
        reason: 'no-cookies'
      });
    }

    return null;
  }

  const req = {
    cookies: cookieStore,
    headers: {
      cookie: allCookies.map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
    }
  } as unknown as Parameters<typeof getToken>[0]['req'];

  const sessionCookieVariants = [
    {
      cookieName: '__Secure-next-auth.session-token',
      secureCookie: true
    },
    {
      cookieName: 'next-auth.session-token',
      secureCookie: false
    }
  ].filter(({ cookieName }) =>
    allCookies.some(
      (cookie) => cookie.name === cookieName || cookie.name.startsWith(`${cookieName}.`)
    )
  );

  if (authDebugEnabled) {
    console.info('[auth][token]', {
      source: 'getJwtTokenFromCookies',
      availableCookieNames: allCookies.map((cookie) => cookie.name),
      sessionCookieVariants: sessionCookieVariants.map((variant) => variant.cookieName)
    });
  }

  for (const variant of sessionCookieVariants) {
    const token = (await getToken({
      req,
      secret: process.env.AUTH_SECRET,
      cookieName: variant.cookieName,
      secureCookie: variant.secureCookie
    })) as JWT | null;

    if (authDebugEnabled) {
      console.info('[auth][token]', {
        source: 'getJwtTokenFromCookies',
        attemptedCookieName: variant.cookieName,
        hasToken: Boolean(token),
        hasAccessToken: typeof token?.accessToken === 'string',
        hasIdToken: typeof token?.idToken === 'string',
        error: token?.error ?? null
      });
    }

    if (token) {
      return {
        token,
        cookieName: variant.cookieName,
        secureCookie: variant.secureCookie,
        existingCookieNames: allCookies.map((cookie) => cookie.name)
      };
    }
  }

  const fallbackToken = (await getToken({
    req,
    secret: process.env.AUTH_SECRET
  })) as JWT | null;

  if (authDebugEnabled) {
    console.info('[auth][token]', {
      source: 'getJwtTokenFromCookies',
      attemptedCookieName: 'default',
      hasToken: Boolean(fallbackToken),
      hasAccessToken: typeof fallbackToken?.accessToken === 'string',
      hasIdToken: typeof fallbackToken?.idToken === 'string',
      error: fallbackToken?.error ?? null
    });
  }

  if (!fallbackToken) return null;

  const secureCookie = process.env.NODE_ENV === 'production';
  return {
    token: fallbackToken,
    cookieName: secureCookie ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
    secureCookie,
    existingCookieNames: allCookies.map((cookie) => cookie.name)
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
