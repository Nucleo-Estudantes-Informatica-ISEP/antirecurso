import { getApiAccessToken } from '@/lib/server-auth';

export default async function fetchReports(fetchUrl: string | null) {
  if (!fetchUrl) throw new Error('No fetch url provided');

  const token = await getApiAccessToken();

  if (!token) {
    throw new Error('Authentication required');
  }

  const res = await fetch(fetchUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  if (res.status !== 200) throw new Error('Could not fetch reports');

  return await res.json();
}
