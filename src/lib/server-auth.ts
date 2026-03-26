import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import type { JWT } from 'next-auth/jwt';
import { authOptions } from '@/lib/auth';

export const CLIENT_SESSION_TOKEN = 'server-session';
const authDebugEnabled = process.env.AUTH_DEBUG === 'true';

export async function getAppAuthSession() {
  const session = await getServerSession(authOptions);

  if (authDebugEnabled) {
    console.info('[auth][session]', {
      source: 'getAppAuthSession',
      hasUser: Boolean(session?.user),
      userId: session?.user?.id ?? null,
      userEmail: session?.user?.email ?? null,
      error: session?.error ?? null
    });
  }

  return session;
}

export async function getApiAccessToken() {
  const token = await getJwtTokenFromCookies();

  if (!token || isAccessTokenExpired(token)) {
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
      return token;
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

  return fallbackToken;
}

export function isAccessTokenExpired(token: JWT | null) {
  if (!token || typeof token.accessToken !== 'string') {
    return true;
  }

  if (token.error === 'AccessTokenExpired') {
    return true;
  }

  if (
    typeof token.accessTokenExpiresAt === 'number' &&
    Number.isFinite(token.accessTokenExpiresAt) &&
    Date.now() >= token.accessTokenExpiresAt
  ) {
    return true;
  }

  return false;
}
