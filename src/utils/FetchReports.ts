import { getApiAccessToken } from '@/lib/server-auth';
import { apiRequest } from '@/services/apiClient';

export default async function fetchReports(fetchUrl: string | null) {
  if (!fetchUrl) throw new Error('No fetch url provided');

  const token = await getApiAccessToken();

  if (!token) {
    throw new Error('Authentication required');
  }

  return apiRequest(fetchUrl, {
    authenticated: true,
    accessToken: token,
    errorMessage: 'Could not fetch reports'
  });
}
