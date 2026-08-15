import type { AuthNeiRole } from '@/lib/auth-nei-roles';

export async function provisionStudentForNormalOnboarding(
  subject: string,
  currentRoles: readonly AuthNeiRole[]
): Promise<'already-student' | 'provisioned'> {
  if (currentRoles.includes('student')) return 'already-student';
  if (currentRoles.includes('employee')) {
    throw new Error('AuthNEI identities with employee but without student cannot be provisioned.');
  }

  const baseUrl = process.env.AUTHNEI_PROVISIONER_URL?.trim().replace(/\/+$/, '');
  const serviceToken = process.env.AUTHNEI_PROVISIONER_TOKEN?.trim();
  if (!baseUrl || !serviceToken) {
    throw new Error(
      'AuthNEI user is unclassified and the ensure-student provisioner is not configured.'
    );
  }

  const url = new URL(`${baseUrl}/roles/ensure-student`);
  if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:') {
    throw new Error('AUTHNEI_PROVISIONER_URL must use HTTPS in production.');
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${serviceToken}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({ subject }),
    cache: 'no-store',
    signal: AbortSignal.timeout(5_000)
  });
  if (!response.ok) {
    throw new Error(`AuthNEI ensure-student failed with status ${response.status}.`);
  }

  return 'provisioned';
}
