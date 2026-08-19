import { getAuthNeiRoles, type AuthNeiRole } from './auth-nei-roles';

type FetchLike = typeof fetch;

type FetchAuthNeiUserInfoOptions = {
  issuer: string;
  accessToken: string;
  fetchImpl?: FetchLike;
};

export async function fetchAuthNeiUserInfo({
  issuer,
  accessToken,
  fetchImpl = fetch
}: FetchAuthNeiUserInfoOptions): Promise<Record<string, unknown>> {
  const normalizedIssuer = issuer.replace(/\/$/, '');
  const response = await fetchImpl(`${normalizedIssuer}/oidc/v1/userinfo`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error(`ZITADEL userinfo failed with status ${response.status}.`);
  }

  return (await response.json()) as Record<string, unknown>;
}

export async function fetchAuthNeiRolesFromUserInfo(
  options: FetchAuthNeiUserInfoOptions
): Promise<AuthNeiRole[]> {
  const claims = await fetchAuthNeiUserInfo(options);
  return getAuthNeiRoles(claims);
}
