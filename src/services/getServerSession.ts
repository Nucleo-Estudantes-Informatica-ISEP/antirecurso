import { BASE_URL } from '@/services/api';
import { CLIENT_SESSION_TOKEN, getApiAccessToken, getAppAuthSession } from '@/lib/server-auth';
import { Session } from '@/types/Session';
import User from '@/types/User';

export async function getServerSession(): Promise<Session | null> {
  const token = await getApiAccessToken();
  const session = await getAppAuthSession();
  if (!session?.user || !token) return null;

  const res = await fetch(`${BASE_URL}/user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    cache: 'no-store'
  });

  if (res.status !== 200) return null;
  return { token: CLIENT_SESSION_TOKEN, user: (await res.json()) as User };
}

export async function getUserScores() {
  const token = await getApiAccessToken();
  if (!token) return null;

  const res = await fetch(`${BASE_URL}/user/scores`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    cache: 'no-store'
  });

  if (res.status !== 200) return null;
  return await res.json();
}
