import { NextRequest, NextResponse } from 'next/server';
import { isSameOriginRequest } from '@/lib/request-origin';

const headers = {
  'cache-control': 'private, no-store',
  'referrer-policy': 'no-referrer'
};

export async function PATCH(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json(
      { message: 'Request origin is not allowed' },
      { status: 403, headers }
    );
  }

  const issuer = process.env.AUTH_ISSUER_URL?.replace(/\/+$/, '');
  const clientId = process.env.AUTH_CLIENT_ID;
  const redirectUri = process.env.AUTH_POST_LOGOUT_REDIRECT_URI;
  if (!issuer || !clientId || !redirectUri) {
    return NextResponse.json({ url: '/' }, { headers });
  }

  const logoutUrl = new URL(`${issuer}/oidc/v1/end_session`);
  logoutUrl.searchParams.set('client_id', clientId);
  logoutUrl.searchParams.set('post_logout_redirect_uri', redirectUri);
  return NextResponse.json({ url: logoutUrl.toString() }, { headers });
}
