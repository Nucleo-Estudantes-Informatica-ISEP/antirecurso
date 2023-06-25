import { BASE_URL } from 'src/services/api';
import Question from 'src/types/Question';

const generateExam = async (
  id: number,
  mode: string,
  token: string | null
): Promise<Question[] | null> => {
  const res = await fetch(BASE_URL + `/exams/generate/${id}?mode=${mode}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : ''
    }
  });

  if (res.status !== 200) return null;

  const exam = await res.json();
  return exam;
};

export default generateExam;
