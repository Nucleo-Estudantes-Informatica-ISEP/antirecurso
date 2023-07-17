import { cookies } from 'next/dist/client/components/headers';

import config from '@/config';
import fetchSessionUser from './fetchSessionUser';

const getServerSession = () => {
  const cookie = cookies().get(config.cookies.token);
  const token = cookie?.value as string;

  if (!token) return null;

  return fetchSessionUser(token);
};

export default getServerSession;
