import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { BASE_URL } from '@/services/api';

export const dynamic = 'force-dynamic';

async function proxyRequest(request: NextRequest, { params }: { params: { path: string[] } }) {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
  const accessToken = typeof token?.accessToken === 'string' ? token.accessToken : null;
  const isExpired =
    token?.error === 'AccessTokenExpired' ||
    (typeof token?.accessTokenExpiresAt === 'number' && Date.now() >= token.accessTokenExpiresAt);

  if (!accessToken || isExpired) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  const targetUrl = new URL(`${BASE_URL}/${params.path.join('/')}`);
  request.nextUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.append(key, value);
  });

  const headers = new Headers();
  headers.set('accept', 'application/json');
  headers.set('authorization', `Bearer ${accessToken}`);

  const contentType = request.headers.get('content-type');
  if (contentType) {
    headers.set('content-type', contentType);
  }

  const body =
    request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.text();

  const upstreamResponse = await fetch(targetUrl, {
    method: request.method,
    headers,
    body,
    cache: 'no-store'
  });

  const responseHeaders = new Headers();
  const upstreamContentType = upstreamResponse.headers.get('content-type');
  if (upstreamContentType) {
    responseHeaders.set('content-type', upstreamContentType);
  }

  return new NextResponse(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: responseHeaders
  });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PATCH = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
