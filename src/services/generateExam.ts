import config from 'src/config';
import { BASE_URL, PROTECTED_API_BASE_URL } from 'src/services/api';
import Question from 'src/types/Question';

const generateExam = async (
  id: number,
  mode: string,
  token: string | null,
  n_of_questions?: number,
  filter?: string
): Promise<Question[] | null> => {
  if (config.mandatoryAuthModes.includes(mode) && !token) return null;

  const urlParams = new URLSearchParams();
  urlParams.set('mode', mode);
  if (n_of_questions) urlParams.set('n_of_questions', n_of_questions.toString());
  if (filter) urlParams.set('filter', filter);

  const baseUrl = token ? PROTECTED_API_BASE_URL : BASE_URL;
  const url = `${baseUrl}/exams/generate/${id}?${urlParams.toString()}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers
    });
    if (res.status !== 200) return null;

    const exam = await res.json();
    return exam;
  } catch (error) {
    return null;
  }
};

export default generateExam;
