import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const compose = readFileSync(new URL('../../compose.yml', import.meta.url), 'utf8');
const dockerfile = readFileSync(new URL('../../Dockerfile', import.meta.url), 'utf8');

describe('Coolify deployment configuration', () => {
  it('uses Coolify service URLs instead of COOLIFY_URL', () => {
    expect(compose).not.toContain('COOLIFY_URL');
    expect(compose).toContain('SERVICE_URL_WEB_3000');
    expect(compose).toContain('/api/backend');
  });

  it('keeps the upstream API separate from the protected frontend proxy', () => {
    expect(compose).toContain('NEXT_PUBLIC_BASE_URL');
    expect(compose).toContain('NEXT_PUBLIC_PROTECTED_API_BASE_URL');
    expect(dockerfile).toContain('ARG NEXT_PUBLIC_BASE_URL');
    expect(dockerfile).toContain('ARG NEXT_PUBLIC_PROTECTED_API_BASE_URL');
  });

  it('derives AuthNEI scopes and the shared admin claim from project IDs', () => {
    expect(compose).toContain('AUTH_PROJECT_ID');
    expect(compose).toContain('AUTH_GLOBAL_PROJECT_ID');
    expect(compose).toContain('urn:zitadel:iam:org:projects:roles');
    expect(compose).toContain('urn:zitadel:iam:org:project:${AUTH_GLOBAL_PROJECT_ID}:roles');
  });
});
