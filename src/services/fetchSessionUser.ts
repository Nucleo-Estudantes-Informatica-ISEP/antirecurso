import { BASE_URL } from 'src/services/api';
import User from 'src/types/User';

const fetchSessionUser = async (token: string | undefined): Promise<User | null> => {
  if (!token) return null;

  const res = await fetch(`${BASE_URL}/user`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    cache: 'no-store'
  });

  if (res.status === 401) return null;

  return (await res.json()) as User;
};

export default fetchSessionUser;
