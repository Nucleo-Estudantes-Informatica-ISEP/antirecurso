import config from '../config';
import Question from '../types/Question';
import { apiRequest, ApiResponseError } from './apiClient';

const generateExam = async (
  id: number,
  mode: string,
  token: string | null,
  n_of_questions?: number,
  filter?: string
): Promise<Question[]> => {
  if (config.mandatoryAuthModes.includes(mode) && !token) {
    throw new ApiResponseError(401, 'Inicia sessão para usar este modo de exame.');
  }

  const urlParams = new URLSearchParams();
  urlParams.set('mode', mode);
  if (n_of_questions) urlParams.set('n_of_questions', n_of_questions.toString());
  if (filter) urlParams.set('filter', filter);

  const path = `exams/generate/${id}?${urlParams.toString()}`;

  return apiRequest<Question[]>(path, {
    authenticated: Boolean(token),
    method: 'GET',
    errorMessage: 'Não foi possível carregar o exame.'
  });
};

export default generateExam;
