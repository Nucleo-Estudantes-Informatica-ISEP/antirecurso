import { getAuthNeiRoles, type AuthNeiRole } from './auth-nei-roles';

type FetchLike = typeof fetch;

type FetchAuthNeiRolesFromUserInfoOptions = {
  issuer: string;
  accessToken: string;
  fetchImpl?: FetchLike;
};

export async function fetchAuthNeiRolesFromUserInfo({
  issuer,
  accessToken,
  fetchImpl = fetch
}: FetchAuthNeiRolesFromUserInfoOptions): Promise<AuthNeiRole[]> {
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

  const claims = (await response.json()) as Record<string, unknown>;
  return getAuthNeiRoles(claims);
}
