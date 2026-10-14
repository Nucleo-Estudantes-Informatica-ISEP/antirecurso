import { useTranslations as translate, type Lang } from '@/i18n/translations';
import config from '../config';
import Question from '../types/Question';
import { apiRequest, ApiResponseError } from './apiClient';

const generateExam = async (
  id: number,
  mode: string,
  token: string | null,
  n_of_questions?: number,
  filter?: string,
  lang: Lang = 'pt'
): Promise<Question[]> => {
  if (config.mandatoryAuthModes.includes(mode) && !token) {
    throw new ApiResponseError(401, translate(lang)('error.signInForMode'));
  }

  const urlParams = new URLSearchParams();
  urlParams.set('mode', mode);
  if (n_of_questions) urlParams.set('n_of_questions', n_of_questions.toString());
  if (filter) urlParams.set('filter', filter);

  const path = `exams/generate/${id}?${urlParams.toString()}`;

  return apiRequest<Question[]>(path, {
    authenticated: Boolean(token),
    method: 'GET',
    errorMessage: translate(lang)('error.loadExam')
  });
};

export default generateExam;
