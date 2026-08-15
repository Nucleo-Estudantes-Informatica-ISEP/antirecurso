export const AUTH_NEI_ROLES = ['student', 'nei_member', 'admin', 'employee'] as const;

export type AuthNeiRole = (typeof AUTH_NEI_ROLES)[number];

const ROLE_SET = new Set<string>(AUTH_NEI_ROLES);
const DEFAULT_ROLE_CLAIM = 'urn:zitadel:iam:org:project:roles';
const ZITADEL_PROJECT_ROLE_CLAIM = /^urn:zitadel:iam:org:project(?::id:[^:]+)?:roles$/;

function rolesFromValue(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((role): role is string => typeof role === 'string');
  if (typeof value === 'string') return value.split(/[\s,]+/);
  if (value && typeof value === 'object') return Object.keys(value);
  return [];
}

export function getAuthNeiRoles(
  claims: Record<string, unknown> | undefined,
  configuredClaim = process.env.AUTH_ROLE_CLAIM ?? DEFAULT_ROLE_CLAIM
): AuthNeiRole[] {
  if (!claims) return [];

  const claimKeys = new Set([
    configuredClaim,
    DEFAULT_ROLE_CLAIM,
    ...Object.keys(claims).filter((key) => ZITADEL_PROJECT_ROLE_CLAIM.test(key))
  ]);
  const roles = new Set<AuthNeiRole>();

  claimKeys.forEach((key) => {
    for (const role of rolesFromValue(claims[key])) {
      if (ROLE_SET.has(role)) roles.add(role as AuthNeiRole);
    }
  });

  return AUTH_NEI_ROLES.filter((role) => roles.has(role));
}

export function getAuthNeiRolesFromJwt(jwt: unknown): AuthNeiRole[] {
  if (typeof jwt !== 'string') return [];
  const payload = jwt.split('.')[1];
  if (!payload) return [];

  try {
    return getAuthNeiRoles(JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')));
  } catch {
    return [];
  }
}

export function hasAuthNeiRole(
  source: { authNeiRoles?: readonly AuthNeiRole[]; roles?: readonly AuthNeiRole[] } | undefined,
  role: AuthNeiRole
) {
  if (!source) return false;
  const roles = source.authNeiRoles ?? source.roles;
  return roles?.includes(role) ?? false;
}
