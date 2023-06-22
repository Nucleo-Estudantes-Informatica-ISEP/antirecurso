import { cookies } from 'next/headers';
import config from 'src/config';

// workaround to read cookies in client components
export default async function useToken(): Promise<string | null> {
  const res = await fetch('/api/auth/session', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (res.status === 200) return (await res.json()).data;

  cookies().delete(config.cookies.token);
  return null;
}
