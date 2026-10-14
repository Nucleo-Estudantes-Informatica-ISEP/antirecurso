import { beforeEach, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { apiFetch } from '@/services/apiClient';
import { proxy } from './proxy';
vi.mock('next-auth/jwt', () => ({ getToken: vi.fn() }));
vi.mock('@/services/apiClient', () => ({ apiFetch: vi.fn() }));
beforeEach(() => vi.clearAllMocks());

it('redirects unprefixed entry using cookie, browser, then Portuguese', async () => {
  for (const [headers, expected] of [
    [{ cookie: 'locale=pt', 'accept-language': 'en-US' }, 'pt'],
    [{ 'accept-language': 'en-US' }, 'en'],
    [{ 'accept-language': 'fr' }, 'pt']
  ] as const) {
    const res = await proxy(new NextRequest('http://localhost/exams?filter=new', { headers }));
    expect(res.headers.get('location')).toBe(`http://localhost/${expected}/exams?filter=new`);
    expect(res.headers.get('set-cookie')).toBeNull();
  }
});
it('serves the original page with the explicit language, overriding incoming headers', async () => {
  const res = await proxy(
    new NextRequest('http://localhost/en/exams?filter=new', {
      headers: { cookie: 'locale=pt', 'x-app-language': 'pt' }
    })
  );
  expect(res.headers.get('location')).toBeNull();
  expect(res.headers.get('x-middleware-rewrite')).toBe('http://localhost/exams?filter=new');
  expect(res.headers.get('x-middleware-request-x-app-language')).toBe('en');
});
it('does not localize API or assets, and never aliases API through a locale', async () => {
  for (const path of ['/api/auth/callback/zitadel', '/_next/static/test.js', '/robots.txt']) {
    const res = await proxy(new NextRequest(`http://localhost${path}`));
    expect(res.headers.get('location')).toBeNull();
    expect(res.headers.get('x-middleware-rewrite')).toBeNull();
  }
  expect((await proxy(new NextRequest('http://localhost/en/api/auth/session'))).status).toBe(404);
});
it('keeps anonymous, expired and non-admin users out of every admin prefix', async () => {
  for (const token of [
    null,
    { accessToken: 'token', authNeiRoles: [] },
    { accessToken: 'token', authNeiRoles: ['admin' as const], accessTokenExpiresAt: 1 }
  ]) {
    vi.mocked(getToken).mockResolvedValue(token);
    for (const path of ['/admin/users', '/pt/admin/users', '/en/admin/users']) {
      const res = await proxy(new NextRequest(`http://localhost${path}`));
      expect(res.headers.get('x-middleware-rewrite')).toBe('http://localhost/');
    }
  }
  expect(apiFetch).not.toHaveBeenCalled();
});
it('still requires API permission for an administrator', async () => {
  vi.mocked(getToken).mockResolvedValue({ accessToken: 'token', authNeiRoles: ['admin'] });
  vi.mocked(apiFetch).mockResolvedValue(new Response(null, { status: 403 }));
  expect(
    (await proxy(new NextRequest('http://localhost/en/admin/users'))).headers.get(
      'x-middleware-rewrite'
    )
  ).toBe('http://localhost/');
  vi.mocked(apiFetch).mockResolvedValue(new Response(null, { status: 200 }));
  expect(
    (await proxy(new NextRequest('http://localhost/en/admin/users'))).headers.get(
      'x-middleware-rewrite'
    )
  ).toBe('http://localhost/admin/users');
  expect(apiFetch).toHaveBeenCalledWith('admin', { authenticated: true, accessToken: 'token' });
});
