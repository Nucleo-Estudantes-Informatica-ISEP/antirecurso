import PendingExam from '@/types/PendingExam';
import { apiRequest } from '@/services/apiClient';

const fetchUserPendingExams = async (
  url: string | null
): Promise<{ data: PendingExam[] } | null> => {
  if (!url) return null;

  return apiRequest<{ data: PendingExam[] }>(url, {
    authenticated: true,
    cache: 'no-store',
    errorMessage: 'Could not fetch pending exams'
  });
};

export default fetchUserPendingExams;
