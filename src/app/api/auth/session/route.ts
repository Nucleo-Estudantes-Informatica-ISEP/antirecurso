import { NextResponse } from 'next/server';
import { BASE_URL } from '@/services/api';
import { CLIENT_SESSION_TOKEN, getApiAccessToken } from '@/lib/server-auth';

const authDebugEnabled = process.env.AUTH_DEBUG === 'true';

export async function GET() {
  const accessToken = await getApiAccessToken();

  if (authDebugEnabled) {
    console.info('[auth][session-route]', {
      hasAccessToken: Boolean(accessToken)
    });
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
