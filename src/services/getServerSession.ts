import { cookies } from 'next/headers';

import config from '@/config';
import { BASE_URL } from '@/services/api';
import { Session } from '@/types/Session';
import User from '@/types/User';

const getServerSession = async (): Promise<Session | null> => {
  const cookie = cookies().get(config.cookies.token);
  const token = cookie?.value as string;
  if (!token) return null;

  const res = await fetch(`${BASE_URL}/user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    cache: 'no-store'
  });

  if (res.status !== 200) return null;
  return { token, user: (await res.json()) as User };
};

export default getServerSession;
