import { afterEach, describe, expect, it, vi } from 'vitest';

import { authOptions } from './auth';

const signIn = authOptions.callbacks?.signIn;

if (!signIn) {
  throw new Error('Expected NextAuth signIn callback to be configured.');
}

type SignInInput = Parameters<typeof signIn>[0];

function signInInput(overrides: Partial<SignInInput> = {}): SignInInput {
  return {
    user: { id: 'user-123' },
    account: {
      provider: 'zitadel',
      type: 'oauth',
      providerAccountId: 'user-123',
      access_token: 'access-token'
    },
    profile: {
      sub: 'user-123',
      email: 'student@example.com'
    },
    ...overrides
  } as SignInInput;
}

describe('ZITADEL sign-in verification', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('accepts a verified email from UserInfo when the ID-token profile omits email_verified', async () => {
    const fetchMock = vi.fn(async () =>
      new Response(
        JSON.stringify({
          sub: 'user-123',
          email: 'student@example.com',
          email_verified: true
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(signIn(signInInput())).resolves.toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(expect.stringMatching(/\/oidc\/v1\/userinfo$/), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer access-token'
      }
    });
  });

  it('fails closed when UserInfo does not affirm email verification', async () => {
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ sub: 'user-123', email_verified: false }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(signIn(signInInput())).resolves.toBe(false);
  });

  it('fails closed when UserInfo belongs to a different subject', async () => {
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ sub: 'other-user', email_verified: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(signIn(signInInput())).resolves.toBe(false);
  });

  it('fails closed when ZITADEL UserInfo cannot be queried', async () => {
    const fetchMock = vi.fn(async () => new Response(null, { status: 401 }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(signIn(signInInput())).resolves.toBe(false);
  });
});
