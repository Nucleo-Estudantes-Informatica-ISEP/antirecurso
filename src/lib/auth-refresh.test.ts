import { afterEach, describe, expect, it, vi } from 'vitest';
import type { JWT } from 'next-auth/jwt';

import { refreshAccessToken } from './auth';

describe('access-token refresh', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('coalesces concurrent refreshes for the same rotating token', async () => {
    const fetchMock = vi.fn(async (input: string | URL | Request) => {
      const url = String(input);

      if (url.endsWith('/oauth/v2/token')) {
        return new Response(
          JSON.stringify({
            access_token: 'new-access-token',
            refresh_token: 'new-refresh-token',
            expires_in: 3600
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (url.endsWith('/oidc/v1/userinfo')) {
        return new Response(JSON.stringify({}), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      throw new Error(`Unexpected fetch: ${url}`);
    });
    vi.stubGlobal('fetch', fetchMock);

    const token = {
      accessToken: 'old-access-token',
      refreshToken: 'old-refresh-token'
    } as JWT;

    const [first, second] = await Promise.all([
      refreshAccessToken(token),
      refreshAccessToken(token)
    ]);

    const tokenRequests = fetchMock.mock.calls.filter(([input]) =>
      String(input).endsWith('/oauth/v2/token')
    );
    const userInfoRequests = fetchMock.mock.calls.filter(([input]) =>
      String(input).endsWith('/oidc/v1/userinfo')
    );

    expect(tokenRequests).toHaveLength(1);
    expect(userInfoRequests).toHaveLength(1);
    expect(first.accessToken).toBe('new-access-token');
    expect(second.refreshToken).toBe('new-refresh-token');
  });
});
