import { describe, expect, it } from 'vitest';
import type { JWT } from 'next-auth/jwt';
import { authOptions } from './auth';

const jwtCallback = authOptions.callbacks?.jwt;
const sessionCallback = authOptions.callbacks?.session;

if (!jwtCallback || !sessionCallback) {
  throw new Error('Expected NextAuth JWT and session callbacks to be configured.');
}

describe('AuthNEI token storage contract', () => {
  it('stores the provider access token in the encrypted server-side JWT', async () => {
    const token = await jwtCallback({
      token: { sub: 'authnei-user' } as JWT,
      user: { id: 'authnei-user' },
      account: {
        provider: 'zitadel',
        type: 'oauth',
        providerAccountId: 'authnei-user',
        access_token: 'production-access-token',
        refresh_token: 'production-refresh-token',
        expires_at: Math.floor(Date.now() / 1000) + 3600
      },
      profile: { sub: 'authnei-user', email: 'student@example.com', name: 'Student' },
      isNewUser: false,
      trigger: 'signIn'
    });

    expect(token).toMatchObject({
      accessToken: 'production-access-token',
      refreshToken: 'production-refresh-token',
      userEmail: 'student@example.com',
      userName: 'Student'
    });
  });

  it('does not expose provider tokens through the browser session', async () => {
    const session = await sessionCallback({
      session: {
        user: { name: null, email: null, image: null, roles: [] },
        expires: new Date(Date.now() + 3600_000).toISOString()
      },
      token: {
        sub: 'authnei-user',
        accessToken: 'secret-access-token',
        refreshToken: 'secret-refresh-token',
        userEmail: 'student@example.com',
        userName: 'Student'
      } as JWT,
      user: {
        id: 'authnei-user',
        email: 'student@example.com',
        emailVerified: null
      },
      newSession: undefined,
      trigger: 'update'
    });

    expect(session.user).toMatchObject({
      id: 'authnei-user',
      email: 'student@example.com',
      name: 'Student'
    });
    expect(session).not.toHaveProperty('accessToken');
    expect(session).not.toHaveProperty('refreshToken');
  });
});
