import { NextRequest, NextResponse } from 'next/server';
import { BASE_URL } from '@/services/api';
import { CLIENT_SESSION_TOKEN, getApiAccessToken, getAppAuthSession } from '@/lib/server-auth';

const authDebugEnabled = process.env.AUTH_DEBUG ='true';

const AUTH_COOKIE_NAMES = [
  'next-auth.session-token',
  '__Secure-next-auth.session-token',
  'next-auth.callback-url',
  '__Secure-next-auth.callback-url',
  'next-auth.csrf-token',
  '__Host-next-auth.csrf-token'
] as const;

function clearAuthCookies(_response: NextResponse, existingCookieNames: string[] = []) {
  // NOTE: cookie destruction moved to /api/auth/signout so /session is read-only.
  // Left as a no-op to avoid accidental reintroduction of silent logout behavior.
  return _response;
}

export async function GET(request: NextRequest) {
  const existingCookieNames = request.cookies.getAll().map(({ name }) => name);
  const session = await getAppAuthSession();
  const accessToken = await getApiAccessToken();

  if (authDebugEnabled) {
    console.info('[auth][session-route]', {
      hasSessionUser: Boolean(session?.user),
      sessionUserId: session?.user?.id ?? null,
      sessionUserEmail: session?.user?.email ?? null,
      sessionError: session?.error ?? null,
      hasAccessToken: Boolean(accessToken)
    });
  }

  if (!session?.user) {
    return new NextResponse(null, { status: 401 });
  }

  if (!accessToken) {
    if (authDebugEnabled) {
      console.warn('[auth][session-route]', {
        reason: 'missing-access-token'
      });
    }

    return new NextResponse(null, { status: 401 });
  }

  if (!BASE_URL) {
    if (authDebugEnabled) {
      console.error('[auth][session-route]', {
        reason: 'missing-base-url'
      });
    }

    return NextResponse.json({ message: 'API base URL is not configured' }, { status: 500 });
  }

  const res = await fetch(`${BASE_URL}/user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    cache: 'no-store'
  });

  if (res.status !== 200) {
    if (authDebugEnabled) {
      console.warn('[auth][session-route]', {
        reason: 'backend-user-fetch-failed',
        backendStatus: res.status
      });
    }

    return new NextResponse(null, { status: 502 });
  }

  return NextResponse.json(
    { token: CLIENT_SESSION_TOKEN, user: await res.json() },
    { status: 200 }
  );
}