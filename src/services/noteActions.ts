import { authenticatedBackendFetch, throwBackendResponseError } from './authenticatedBackend';

export async function requestNoteVisit(
  noteId: number,
  fetchAuthenticated: typeof authenticatedBackendFetch = authenticatedBackendFetch
) {
  const response = await fetchAuthenticated(`notes/${noteId}/view`, { method: 'POST' });
  if (!response.ok) {
    await throwBackendResponseError(response, 'Não foi possível registar a visita ao resumo.');
  }

  const data = (await response.json()) as { url?: unknown };
  if (typeof data.url !== 'string' || !data.url) {
    throw new Error('O backend não devolveu um URL válido para o resumo.');
  }

  return data.url;
}

export async function toggleNoteLike(
  noteId: number,
  fetchAuthenticated: typeof authenticatedBackendFetch = authenticatedBackendFetch
) {
  const response = await fetchAuthenticated(`notes/${noteId}/like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) {
    await throwBackendResponseError(response, 'Não foi possível gostar do resumo.');
  }
}
