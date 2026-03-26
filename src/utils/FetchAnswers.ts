import Answer from '@/types/Answer';
import { Paginate } from '@/types/Paginate';

export default async function fetchAnswers(fetchUrl: string | null): Promise<Paginate<Answer>> {
  if (!fetchUrl) throw new Error('No fetch url provided');

  const response = await fetch(fetchUrl, {
    headers: {
      'Content-Type': 'application/json'
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error('Could not fetch previous exams');
  }

  return response.json() as Promise<Paginate<Answer>>;
}
