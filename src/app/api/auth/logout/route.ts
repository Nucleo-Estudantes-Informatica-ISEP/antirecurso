import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

function getSafeRedirectUrl(request: NextRequest) {
  return new URL('/', request.nextUrl.origin).toString();
}

function isAbsoluteHttpUrl(value?: string) {
  if (!value) return false;

  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function PATCH(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
  const issuer = process.env.AUTH_ISSUER_URL?.replace(/\/$/, '');
  const clientId = process.env.AUTH_CLIENT_ID;
  const postLogoutRedirectUri = process.env.AUTH_POST_LOGOUT_REDIRECT_URI;
  const fallbackRedirectUrl = getSafeRedirectUrl(request);

  if (!issuer || !clientId || !isAbsoluteHttpUrl(postLogoutRedirectUri)) {
    return NextResponse.json({ url: fallbackRedirectUrl }, { status: 200 });
  }

  const validatedPostLogoutRedirectUri = postLogoutRedirectUri as string;
  const logoutUrl = new URL(`${issuer}/oidc/v1/end_session`);
  logoutUrl.searchParams.set('client_id', clientId);
  logoutUrl.searchParams.set('post_logout_redirect_uri', validatedPostLogoutRedirectUri);
  logoutUrl.searchParams.set('state', crypto.randomUUID());

  if (typeof token?.idToken === 'string') {
    logoutUrl.searchParams.set('id_token_hint', token.idToken);
  }

  return NextResponse.json({ url: logoutUrl.toString() }, { status: 200 });
}
