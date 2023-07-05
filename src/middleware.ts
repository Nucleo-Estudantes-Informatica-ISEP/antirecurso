import c from '@/config';
import { BASE_URL } from '@/services/api';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: '/admin/:path*'
};

export async function middleware(request: NextRequest) {
  const t = request.cookies.get(c.cookies.token) as { value: string } | undefined;
  const token = t?.value;

  if (!token) return NextResponse.rewrite(new URL('/', request.url));

  const res = await fetch(`${BASE_URL}/admin`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  if (res.status !== 200) return NextResponse.rewrite(new URL('/', request.url));

  return NextResponse.next();
}
