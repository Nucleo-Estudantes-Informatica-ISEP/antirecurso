import { langFromPath, languageCookie, preferredLang, withoutLang } from '@/i18n/translations';
import { apiFetch } from '@/services/apiClient';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { hasAuthNeiRole } from '@/lib/auth-nei-roles';

export const config = {
  matcher: '/((?!api(?:/|$)|_next(?:/|$)|.*\\..*).*)'
};

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (/^\/(api|_next)(?:\/|$)/.test(pathname) || pathname.includes('.')) return NextResponse.next();
  const explicit = langFromPath(pathname);
  const lang =
    explicit ??
    preferredLang(
      request.cookies.get(languageCookie)?.value,
      request.headers.get('accept-language')
    );
  const barePath = withoutLang(pathname);
  // API routes keep their original URLs; a localized URL must not alias them.
  if (explicit && /^\/(api|_next)(?:\/|$)/.test(barePath))
    return new NextResponse(null, { status: 404 });

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-app-language', lang);
  function rewrite(path: string) {
    const url = request.nextUrl.clone();
    url.pathname = path;
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }

  if (barePath === '/admin' || barePath.startsWith('/admin/')) {
    const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
    const accessToken = typeof token?.accessToken === 'string' ? token.accessToken : null;
    const isExpired =
      token?.error === 'AccessTokenExpired' ||
      (typeof token?.accessTokenExpiresAt === 'number' && Date.now() >= token.accessTokenExpiresAt);

    if (!accessToken || isExpired || !hasAuthNeiRole(token ?? undefined, 'admin')) {
      return rewrite('/');
    }

    const res = await apiFetch('admin', {
      authenticated: true,
      accessToken
    });

    if (res.status !== 200) return rewrite('/');
  }
  if (!explicit) {
    const url = request.nextUrl.clone();
    url.pathname = '/' + lang + (pathname === '/' ? '' : pathname);
    return NextResponse.redirect(url);
  }
  return rewrite(barePath);
}
