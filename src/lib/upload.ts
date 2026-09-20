import { UploadResponse } from '@/types/UploadResponse';
import { BASE_URL } from '@/services/api';
import { apiRequest } from '@/services/apiClient';

export async function getSignedUrl(target: string, contentType: string) {
  const signed = await apiRequest<Partial<UploadResponse>>('upload', {
    authenticated: true,
    method: 'POST',
    json: { target, contentType },
    errorMessage: 'Ocorreu um erro no upload (getSignedUrl).'
  });

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
  const { url } = await apiRequest<{ url: string }>(`students/${code}/${signed.target}`, {
    method: 'POST',
    json: { uploadId: signed.id }
  });
  return url;
}
