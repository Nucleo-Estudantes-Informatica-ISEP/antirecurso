import { getApiAccessToken } from '@/lib/server-auth';
import { BASE_URL } from '@/services/api';
import { Comment } from '@/types/Comment';
import { Paginate } from '@/types/Paginate';

export async function fetchComments(): Promise<Paginate<Comment>> {
  const token = await getApiAccessToken();

  if (!token) {
    throw new Error('Authentication required');
  }

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
