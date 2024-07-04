import Answer from '@/types/Answer';
import { Paginate } from '@/types/Paginate';

export default async function fetchAnswers(
  fetchUrl: string | null,
  token: string | null
): Promise<Paginate<Answer>> {
  if (!fetchUrl) throw new Error('No fetch url provided');

  const response = await fetch(fetchUrl, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    cache: 'no-store'
  });

  const data = await response.json();

  return data;
}
