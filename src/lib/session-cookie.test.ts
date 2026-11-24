import { afterEach, describe, expect, it, vi } from 'vitest';

import { encode } from 'next-auth/jwt';
import { buildSessionCookieUpdates, readSessionToken } from './session-cookie';

describe('session cookie rotation', () => {
  it('clears prior chunks and writes a reconstructable large token', () => {
    const encodedToken = 'x'.repeat(8_000);
    const updates = buildSessionCookieUpdates(
      ['__Secure-next-auth.session-token.0', '__Secure-next-auth.session-token.1'],
      '__Secure-next-auth.session-token',
      encodedToken,
      3600
    );

    expect(updates.slice(0, 2).every((cookie) => cookie.maxAge === 0)).toBe(true);
    expect(updates.slice(2).map((cookie) => cookie.name)).toEqual([
      '__Secure-next-auth.session-token.0',
      '__Secure-next-auth.session-token.1',
      '__Secure-next-auth.session-token.2'
    ]);
    expect(
      updates
        .slice(2)
        .map((cookie) => cookie.value)
        .join('')
    ).toBe(encodedToken);
  });

  it('uses the unchunked base name for a small token', () => {
    const updates = buildSessionCookieUpdates([], 'next-auth.session-token', 'token', 3600);

    expect(updates).toEqual([{ name: 'next-auth.session-token', value: 'token', maxAge: 3600 }]);
  });
});

describe('session cookie selection', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('selects secure cookies on HTTPS and regular cookies on local HTTP', async () => {
    const secret = 'synthetic-test-session-secret';
    const value = await encode({ token: { sub: 'test-user' }, secret });
    const local = { name: 'next-auth.session-token', value };
    const secure = { name: '__Secure-next-auth.session-token', value };

    vi.stubEnv('AUTH_SECRET', secret);
    vi.stubEnv('NEXTAUTH_URL', 'https://web.test');
    expect(await readSessionToken([local])).toBeNull();
    expect(await readSessionToken([secure])).toMatchObject({ sub: 'test-user' });

    vi.stubEnv('NEXTAUTH_URL', 'http://localhost:3000');
    expect(await readSessionToken([local])).toMatchObject({ sub: 'test-user' });
    expect(await readSessionToken([secure])).toBeNull();
  });
});
