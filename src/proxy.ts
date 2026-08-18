import { BASE_URL } from '@/services/api';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { hasAuthNeiRole } from '@/lib/auth-nei-roles';

export const config = {
  matcher: '/admin/:path*'
};

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
  const accessToken = typeof token?.accessToken === 'string' ? token.accessToken : null;
  const isExpired =
    token?.error === 'AccessTokenExpired' ||
    (typeof token?.accessTokenExpiresAt === 'number' && Date.now() >= token.accessTokenExpiresAt);

  if (!accessToken || isExpired || !hasAuthNeiRole(token ?? undefined, 'admin')) {
    return NextResponse.rewrite(new URL('/', request.url));
  }

  const res = await fetch(`${BASE_URL}/admin`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (res.status !== 200) return NextResponse.rewrite(new URL('/', request.url));

  return NextResponse.next();
}
