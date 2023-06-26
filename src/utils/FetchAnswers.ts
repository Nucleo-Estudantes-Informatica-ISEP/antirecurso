import PreviousExamResponse from 'src/types/PreviousExamResponse';

export default async function fetchAnswers(
  fetchUrl: string | null,
  token: string | null
): Promise<PreviousExamResponse> {
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
