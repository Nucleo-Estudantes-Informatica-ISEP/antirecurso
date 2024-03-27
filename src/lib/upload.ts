import { UploadResponse } from '@/types/UploadResponse';
import { BASE_URL } from '@/services/api';

export async function getSignedUrl(target: string, contentType: string, token: string) {
  const res = await fetch(BASE_URL + '/upload', {
    body: JSON.stringify({ target, contentType }),
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    method: 'POST'
  });
  return (await res.json()) as UploadResponse;
}

export async function uploadToBucket(signed: UploadResponse, blob: Blob) {
  const res = await fetch(signed.url, {
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
