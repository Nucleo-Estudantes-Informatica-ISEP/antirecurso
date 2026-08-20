import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const issuer = process.env.AUTH_ISSUER_URL?.replace(/\/$/, '');

  if (!issuer) {
    return NextResponse.redirect(new URL('/', request.nextUrl.origin));
  }

  return NextResponse.redirect(new URL('/ui/console/users/me', `${issuer}/`));
}
