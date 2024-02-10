import { cookies } from 'next/headers';
import config from 'src/config';

export default async function fetchReports(fetchUrl: string | null) {
  if (!fetchUrl) throw new Error('No fetch url provided');

  const t = cookies().get(config.cookies.token);
  const token = t?.value;

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
