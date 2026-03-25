import { NextResponse } from 'next/server';
import { BASE_URL } from '@/services/api';
import { CLIENT_SESSION_TOKEN, getApiAccessToken, getAppAuthSession } from '@/lib/server-auth';

function clearAuthCookies(response: NextResponse) {
  for (const cookieName of [
    'next-auth.session-token',
    '__Secure-next-auth.session-token',
    'next-auth.callback-url',
    '__Secure-next-auth.callback-url',
    'next-auth.csrf-token',
    '__Host-next-auth.csrf-token'
  ]) {
    response.cookies.delete(cookieName);
  }
}

export async function GET() {
  const [session, accessToken] = await Promise.all([getAppAuthSession(), getApiAccessToken()]);

  if (!session?.user) {
    return new NextResponse(null, { status: 401 });
  }

  if (!accessToken) {
    const response = new NextResponse(null, { status: 404 });
    clearAuthCookies(response);
    return response;
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
    const response = new NextResponse(null, { status: 404 });
    clearAuthCookies(response);
    return response;
  }

  return NextResponse.json(
    { token: CLIENT_SESSION_TOKEN, user: await res.json() },
    { status: 200 }
  );
}
