import { afterEach, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { PATCH } from './route';

afterEach(() => vi.unstubAllEnvs());

it('returns a non-cacheable provider logout URL without session credentials', async () => {
  vi.stubEnv('NEXTAUTH_URL', 'https://web.test');
  vi.stubEnv('AUTH_ISSUER_URL', 'https://issuer.test');
  vi.stubEnv('AUTH_CLIENT_ID', 'fixture-client');
  vi.stubEnv('AUTH_POST_LOGOUT_REDIRECT_URI', 'https://web.test/');
  const response = await PATCH(
    new NextRequest('https://web.test/api/auth/logout', {
      method: 'PATCH',
      headers: { origin: 'https://web.test' }
    })
  );

  expect(response.status).toBe(200);
  expect(response.headers.get('cache-control')).toBe('private, no-store');
  expect(response.headers.get('referrer-policy')).toBe('no-referrer');
  const { url } = (await response.json()) as { url: string };
  const target = new URL(url);
  expect(target.origin + target.pathname).toBe('https://issuer.test/oidc/v1/end_session');
  expect(Object.fromEntries(target.searchParams)).toEqual({
    client_id: 'fixture-client',
    post_logout_redirect_uri: 'https://web.test/'
  });
});

it('uses the canonical URL for a mixed-case deployment hostname', async () => {
  vi.stubEnv('NEXTAUTH_URL', 'https://preview.web.test');
  vi.stubEnv('AUTH_ISSUER_URL', 'https://issuer.test');
  vi.stubEnv('AUTH_CLIENT_ID', 'fixture-client');
  vi.stubEnv('AUTH_POST_LOGOUT_REDIRECT_URI', 'https://PreView.web.test');
  const response = await PATCH(
    new NextRequest('https://preview.web.test/api/auth/logout', {
      method: 'PATCH',
      headers: { origin: 'https://preview.web.test' }
    })
  );

  expect(response.status).toBe(200);
  const { url } = (await response.json()) as { url: string };
  expect(new URL(url).searchParams.get('post_logout_redirect_uri')).toBe(
    'https://preview.web.test/'
  );
});
