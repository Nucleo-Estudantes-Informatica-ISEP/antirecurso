import Answer from '@/types/Answer';
import { Paginate } from '@/types/Paginate';
import { apiRequest } from '@/services/apiClient';

export default async function fetchAnswers(fetchUrl: string | null): Promise<Paginate<Answer>> {
  if (!fetchUrl) throw new Error('No fetch url provided');

  return apiRequest<Paginate<Answer>>(fetchUrl, {
    authenticated: true,
    cache: 'no-store',
    errorMessage: 'Could not fetch previous exams'
  });
}
