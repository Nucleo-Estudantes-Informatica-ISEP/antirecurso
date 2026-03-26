import { UploadResponse } from '@/types/UploadResponse';
import { BASE_URL, PROTECTED_API_BASE_URL } from '@/services/api';

export async function getSignedUrl(target: string, contentType: string, token: string) {
  const res = await fetch(PROTECTED_API_BASE_URL + '/upload', {
    body: JSON.stringify({ target, contentType }),
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    method: 'POST'
  });

  if (!res.ok) {
    const errorBody = await res.text();
    const details = errorBody ? ` ${errorBody}` : '';
    throw new Error(`Ocorreu um erro no upload (getSignedUrl ${res.status}).${details}`);
  }

  const signed = (await res.json()) as Partial<UploadResponse>;

  if (!signed.url || !signed.id || !signed.target || typeof signed.maxSize !== 'number') {
    throw new Error('Ocorreu um erro no upload (getSignedUrl inválido).');
  }

  return signed as UploadResponse;
}

export async function uploadToBucket(signed: UploadResponse, blob: Blob) {
  if (!signed.url) {
    throw new Error('Ocorreu um erro no upload (bucket URL inválido).');
  }

  const uploadUrl = BASE_URL ? new URL(signed.url, BASE_URL).toString() : signed.url;

  if (signed.uploadMode === 'supabase-signed-put') {
    const res = await fetch(uploadUrl, {
      body: blob,
      method: 'PUT',
      headers: signed.headers
    });
    return res;
  }

  const res = await fetch(uploadUrl, {
    body: blob,
    method: 'PUT',
    headers: signed.headers
  });
  return res;
}

export async function setTarget(code: string, signed: UploadResponse) {
  const res = await fetch(`${BASE_URL}/students/${code}/${signed.target}`, {
    body: JSON.stringify({ uploadId: signed.id }),
    method: 'POST'
  });
  const { url }: { url: string } = await res.json();
  return url;
}
