export const AUTH_NEI_ROLES = ['admin'] as const;

export type AuthNeiRole = (typeof AUTH_NEI_ROLES)[number];

const ROLE_SET = new Set<string>(AUTH_NEI_ROLES);
const DEFAULT_ROLE_CLAIM = 'urn:zitadel:iam:org:project:roles';

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

  // Only consume the role claim for this AntiRecurso ZITADEL Project. Do not merge
  // project-ID role claims from other applications, because roles are app-specific.
  const claimKeys = new Set([configuredClaim, DEFAULT_ROLE_CLAIM]);
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
