import { describe, expect, it, vi } from 'vitest';

import { getAuthNeiRoles } from './auth-nei-roles';
import { fetchAuthNeiRolesFromUserInfo } from './zitadel-userinfo';

describe('AntiRecurso AuthNEI role handling', () => {
  it('reads only the AntiRecurso project role claim', () => {
    const roles = getAuthNeiRoles({
      'urn:zitadel:iam:org:project:roles': {
        admin: { org: 'nei' }
      },
      'urn:zitadel:iam:org:project:orbit-project:roles': {
        admin: { org: 'nei' },
        nei_member: { org: 'nei' }
      }
    });

    expect(roles).toEqual(['admin']);
  });

  it('does not aggregate roles from another ZITADEL project', () => {
    const roles = getAuthNeiRoles({
      'urn:zitadel:iam:org:project:roles': {},
      'urn:zitadel:iam:org:project:orbit-project:roles': {
        admin: { org: 'nei' }
      }
    });

    expect(roles).toEqual([]);
  });

  it('revalidates refreshed roles through ZITADEL userinfo', async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(
        JSON.stringify({
          'urn:zitadel:iam:org:project:roles': {
            admin: { org: 'nei' }
          }
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    );

    const roles = await fetchAuthNeiRolesFromUserInfo({
      issuer: 'https://auth.example.com/',
      accessToken: 'fresh-token',
      fetchImpl: fetchImpl as typeof fetch
    });

    expect(roles).toEqual(['admin']);
    expect(fetchImpl).toHaveBeenCalledWith('https://auth.example.com/oidc/v1/userinfo', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer fresh-token'
      }
    });
  });

  it('fails closed when userinfo cannot revalidate refreshed authorization', async () => {
    const fetchImpl = vi.fn(async () => new Response(null, { status: 401 }));

    await expect(
      fetchAuthNeiRolesFromUserInfo({
        issuer: 'https://auth.example.com',
        accessToken: 'expired-or-invalid-token',
        fetchImpl: fetchImpl as typeof fetch
      })
    ).rejects.toThrow('ZITADEL userinfo failed with status 401.');
  });
});
