import Subject from 'src/types/Subject';
import { apiRequest } from './apiClient';

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
  return normalizeSubjectsResponse(
    await apiRequest('subjects?with_questions=true', {
      cache: 'no-store',
      errorMessage: 'Error fetching subjects'
    })
  );
};

const fetchSubjects = async (): Promise<Subject[]> => {
  return normalizeSubjectsResponse(
    await apiRequest('subjects', { cache: 'no-store', errorMessage: 'Error fetching subjects' })
  );
};

export { fetchSubjectsWithQuestions, fetchSubjects };
