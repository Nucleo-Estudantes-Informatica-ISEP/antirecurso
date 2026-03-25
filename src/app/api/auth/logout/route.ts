import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function PATCH(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
  const issuer = process.env.AUTH_ISSUER_URL?.replace(/\/$/, '');
  const postLogoutRedirectUri = process.env.AUTH_POST_LOGOUT_REDIRECT_URI ?? '/';

  if (!issuer) {
    return NextResponse.json({ url: postLogoutRedirectUri }, { status: 200 });
  }

  const logoutUrl = new URL(`${issuer}/oidc/v1/end_session`);
  logoutUrl.searchParams.set('client_id', process.env.AUTH_CLIENT_ID ?? '');
  logoutUrl.searchParams.set('post_logout_redirect_uri', postLogoutRedirectUri);
  logoutUrl.searchParams.set('state', crypto.randomUUID());

  if (typeof token?.idToken === 'string') {
    logoutUrl.searchParams.set('id_token_hint', token.idToken);
  }

  return NextResponse.json({ url: logoutUrl.toString() }, { status: 200 });
}
