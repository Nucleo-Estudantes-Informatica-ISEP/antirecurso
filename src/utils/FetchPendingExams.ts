import PendingExam from '@/types/PendingExam';

const fetchUserPendingExams = async (
  url: string | null
): Promise<{ data: PendingExam[] } | null> => {
  if (!url) return null;

  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (res.status !== 200) return null;

  const data = await res.json();
  return {
    data: data.data as PendingExam[],
  };
};

export default fetchUserPendingExams;
