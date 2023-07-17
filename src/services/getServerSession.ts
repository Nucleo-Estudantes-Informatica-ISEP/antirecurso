import { cookies } from 'next/headers';

import config from '@/config';
import fetchSessionUser from './fetchSessionUser';

const getServerSession = async () => {
  const cookie = cookies().get(config.cookies.token);
  const token = cookie?.value as string;
  if (!token) return null;

  const user = await fetchSessionUser(token);
  if (!user) return null;

  return { token, user };
};

export default getServerSession;
