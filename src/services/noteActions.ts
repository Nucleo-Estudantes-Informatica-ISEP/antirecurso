import { useTranslations as translate, type Lang } from '@/i18n/translations';
import { apiRequest } from './apiClient';

export async function requestNoteVisit(noteId: number, lang: Lang = 'pt') {
  const data = await apiRequest<{ url?: unknown }>(`notes/${noteId}/view`, {
    authenticated: true,
    method: 'POST',
    errorMessage: translate(lang)('copy.could_not_record_the_visit_to_the_study_notes')
  });
  if (typeof data.url !== 'string' || !data.url) {
    throw new Error(translate(lang)('error.noteUrl'));
  }

  return data.url;
}

export async function toggleNoteLike(noteId: number, lang: Lang = 'pt') {
  await apiRequest(`notes/${noteId}/like`, {
    authenticated: true,
    method: 'POST',
    errorMessage: translate(lang)('copy.could_not_like_the_study_notes')
  });
}
