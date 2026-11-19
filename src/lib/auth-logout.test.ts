import { afterEach, describe, expect, it, vi } from 'vitest';

describe('federated sign-out', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('revokes the API bearer and the provider grant using only server requests', async () => {
    vi.resetModules();
    vi.stubEnv('AUTH_ISSUER_URL', 'https://issuer.test');
    vi.stubEnv('API_BASE_URL', 'https://api.test/api/backend');
    vi.stubEnv('AUTH_CLIENT_ID', 'fixture-client');
    vi.stubEnv('AUTH_CLIENT_SECRET', 'fixture-client-secret');
    const fetchMock = vi.fn<typeof fetch>(async () => new Response(null, { status: 204 }));
    vi.stubGlobal('fetch', fetchMock);

    const { authOptions } = await import('./auth');
    await authOptions.events?.signOut?.({
      token: { accessToken: 'test-access', refreshToken: 'test-refresh' },
      session: { expires: new Date(0).toISOString() }
    });

    expect(fetchMock).toHaveBeenCalledTimes(3);
    const backend = fetchMock.mock.calls.find(([url]) =>
      String(url).endsWith('/api/backend/user/session/revoke')
    );
    expect(new Headers(backend?.[1]?.headers).get('authorization')).toBe('Bearer test-access');
    const provider = fetchMock.mock.calls.filter(
      ([url]) => String(url) === 'https://issuer.test/oauth/v2/revoke'
    );
    expect(provider.map(([, init]) => (init?.body as URLSearchParams).get('token'))).toEqual(
      expect.arrayContaining(['test-access', 'test-refresh'])
    );
    expect(provider.every(([, init]) => init?.redirect === 'error')).toBe(true);
  });
});
