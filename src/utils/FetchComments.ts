import { getApiAccessToken } from '@/lib/server-auth';
import { apiRequest } from '@/services/apiClient';
import { Comment } from '@/types/Comment';
import { Paginate } from '@/types/Paginate';

export async function fetchComments(): Promise<Paginate<Comment>> {
  const token = await getApiAccessToken();

  if (!token) {
    throw new Error('Authentication required');
  }

  return apiRequest<Paginate<Comment>>('comments', {
    authenticated: true,
    accessToken: token,
    errorMessage: 'Could not fetch comments'
  });
}
