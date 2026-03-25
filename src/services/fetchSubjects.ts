import { BASE_URL } from 'src/services/api';
import Subject from 'src/types/Subject';

const normalizeSubjectsResponse = (payload: unknown): Subject[] => {
  if (Array.isArray(payload)) {
    return payload as Subject[];
  }

  if (
    payload &&
    typeof payload === 'object' &&
    'data' in payload &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: Subject[] }).data;
  }

  throw new Error('Invalid subjects response');
};

const fetchSubjectsWithQuestions = async (): Promise<Subject[]> => {
  console.log(BASE_URL);
  const res = await fetch(`${BASE_URL}/subjects?with_questions=true`);
  if (!res.ok) throw new Error('Error fetching subjects');

  return normalizeSubjectsResponse(await res.json());
};

const fetchSubjects = async (): Promise<Subject[]> => {
  const res = await fetch(`${BASE_URL}/subjects`);
  if (!res.ok) throw new Error('Error fetching subjects');

  return normalizeSubjectsResponse(await res.json());
};

export { fetchSubjectsWithQuestions, fetchSubjects };
