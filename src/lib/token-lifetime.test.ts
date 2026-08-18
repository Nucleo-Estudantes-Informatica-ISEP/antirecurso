import { describe, expect, it } from 'vitest';

import { shouldRefreshAccessToken } from './token-lifetime';

describe('access-token lifetime', () => {
  it('refreshes within the safety window', () => {
    const now = 1_000_000;

    expect(shouldRefreshAccessToken(now + 59_000, now)).toBe(true);
    expect(shouldRefreshAccessToken(now + 61_000, now)).toBe(false);
  });

  it('does not invent an expiry for tokens without a finite timestamp', () => {
    expect(shouldRefreshAccessToken(undefined, 1_000_000)).toBe(false);
    expect(shouldRefreshAccessToken(Number.NaN, 1_000_000)).toBe(false);
  });
});
