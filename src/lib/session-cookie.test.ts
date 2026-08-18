import { describe, expect, it } from 'vitest';

import { buildSessionCookieUpdates } from './session-cookie';

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
