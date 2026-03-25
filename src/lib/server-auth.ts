import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import type { JWT } from 'next-auth/jwt';
import { authOptions } from '@/lib/auth';

export const CLIENT_SESSION_TOKEN = 'server-session';

export async function getAppAuthSession() {
  return getServerSession(authOptions);
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
  const cookieHeader = cookies()
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ');

  if (!cookieHeader) {
    return null;
  }

  return (await getToken({
    req: {
      headers: {
        cookie: cookieHeader
      }
    } as unknown as Parameters<typeof getToken>[0]['req'],
    secret: process.env.AUTH_SECRET
  })) as JWT | null;
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
