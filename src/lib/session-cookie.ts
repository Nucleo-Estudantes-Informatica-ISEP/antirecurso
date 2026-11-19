import { getToken } from 'next-auth/jwt';

type CookieSnapshot = { name: string; value: string }[];

export function getSessionCookieConfig() {
  const secureCookie =
    process.env.NODE_ENV === 'production' ||
    Boolean(process.env.NEXTAUTH_URL?.startsWith('https://'));
  return {
    secureCookie,
    cookieName: secureCookie ? '__Secure-next-auth.session-token' : 'next-auth.session-token'
  };
}

export function readSessionToken(cookies: CookieSnapshot) {
  const { cookieName, secureCookie } = getSessionCookieConfig();
  const secret = process.env.AUTH_SECRET;
  const sessionCookies = cookies.filter(
    ({ name }) =>
      name === cookieName ||
      /^\d+$/.test(name.startsWith(`${cookieName}.`) ? name.slice(cookieName.length + 1) : '')
  );
  if (!secret || !sessionCookies.length) return null;

  return getToken({
    req: {
      cookies: Object.fromEntries(sessionCookies.map(({ name, value }) => [name, value])),
      headers: {}
    } as Parameters<typeof getToken>[0]['req'],
    secret,
    cookieName,
    secureCookie
  });
}

const SESSION_COOKIE_CHUNK_SIZE = 3933;

export type SessionCookieUpdate = {
  name: string;
  value: string;
  maxAge: number;
};

export function buildSessionCookieUpdates(
  existingCookieNames: string[],
  baseCookieName: string,
  encodedToken: string,
  maxAge: number
): SessionCookieUpdate[] {
  const expiredChunks = Array.from(new Set(existingCookieNames))
    .filter((name) => name === baseCookieName || name.startsWith(`${baseCookieName}.`))
    .map((name) => ({ name, value: '', maxAge: 0 }));

  const chunkCount = Math.ceil(encodedToken.length / SESSION_COOKIE_CHUNK_SIZE);
  const freshChunks = Array.from({ length: chunkCount }, (_, index) => ({
    name: chunkCount === 1 ? baseCookieName : `${baseCookieName}.${index}`,
    value: encodedToken.slice(
      index * SESSION_COOKIE_CHUNK_SIZE,
      (index + 1) * SESSION_COOKIE_CHUNK_SIZE
    ),
    maxAge
  }));

  return [...expiredChunks, ...freshChunks];
}
