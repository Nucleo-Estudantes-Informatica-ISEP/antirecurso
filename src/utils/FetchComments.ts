import { BASE_URL } from '@/services/api';
import Comment from '@/types/Comment';
import { Paginate } from '@/types/Paginate';
import { cookies } from 'next/headers';
import config from 'src/config';

export async function fetchComments(): Promise<Paginate<Comment>> {
  const t = cookies().get(config.cookies.token);
  const token = t?.value;

  const res = await fetch(`${BASE_URL}/comments`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  if (res.status !== 200) throw new Error('Could not fetch comments');

  return await res.json();
}
