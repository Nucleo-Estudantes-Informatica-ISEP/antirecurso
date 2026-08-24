import config from '../config';
import { BASE_URL } from './api';
import Question from '../types/Question';
import {
  authenticatedBackendFetch,
  BackendResponseError,
  throwBackendResponseError
} from './authenticatedBackend';

const generateExam = async (
  id: number,
  mode: string,
  token: string | null,
  n_of_questions?: number,
  filter?: string
): Promise<Question[]> => {
  if (config.mandatoryAuthModes.includes(mode) && !token) {
    throw new BackendResponseError(401, 'Inicia sessão para usar este modo de exame.');
  }

  const urlParams = new URLSearchParams();
  urlParams.set('mode', mode);
  if (n_of_questions) urlParams.set('n_of_questions', n_of_questions.toString());
  if (filter) urlParams.set('filter', filter);

  const path = `exams/generate/${id}?${urlParams.toString()}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };

  const res = token
    ? await authenticatedBackendFetch(path, {
        method: 'GET',
        headers
      })
    : await fetch(`${BASE_URL}/${path}`, { method: 'GET', headers });

  if (!res.ok) {
    await throwBackendResponseError(res, 'Não foi possível carregar o exame.');
  }

  return (await res.json()) as Question[];
};

export default generateExam;
