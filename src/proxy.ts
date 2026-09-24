import { apiFetch } from '@/services/apiClient';
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

  const res = await apiFetch('admin', {
    authenticated: true,
    accessToken
  });

  if (res.status !== 200) return NextResponse.rewrite(new URL('/', request.url));

  return NextResponse.next();
}
