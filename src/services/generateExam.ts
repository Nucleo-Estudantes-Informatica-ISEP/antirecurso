import config from 'src/config';
import { BASE_URL } from 'src/services/api';
import Question from 'src/types/Question';

const generateExam = async (
  id: number,
  mode: string,
  token: string | null,
  n_of_questions?: number
): Promise<Question[] | null> => {
  if (config.mandatoryAuthModes.includes(mode)) {
    if (!token) return null;
    if (!n_of_questions) {
      const res = await fetch(BASE_URL + `/exams/generate/${id}?mode=${mode}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      if (res.status !== 200) return null;
      const exam = await res.json();
      return exam;
    } else {
      const res = await fetch(
        BASE_URL + `/exams/generate/${id}?mode=${mode}&n_of_questions=${n_of_questions}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (res.status !== 200) return null;
      const exam = await res.json();
      return exam;
    }
  }

  const res = await fetch(BASE_URL + `/exams/generate/${id}?mode=${mode}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (res.status !== 200) return null;

  const exam = await res.json();
  return exam;
};

export default generateExam;
