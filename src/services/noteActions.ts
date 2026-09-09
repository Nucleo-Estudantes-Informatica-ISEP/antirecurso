import { apiRequest } from './apiClient';

export async function requestNoteVisit(noteId: number) {
  const data = await apiRequest<{ url?: unknown }>(`notes/${noteId}/view`, {
    authenticated: true,
    method: 'POST',
    errorMessage: 'Não foi possível registar a visita ao resumo.'
  });
  if (typeof data.url !== 'string' || !data.url) {
    throw new Error('O backend não devolveu um URL válido para o resumo.');
  }

  return data.url;
}

export async function toggleNoteLike(noteId: number) {
  await apiRequest(`notes/${noteId}/like`, {
    authenticated: true,
    method: 'POST',
    errorMessage: 'Não foi possível gostar do resumo.'
  });
}
