import { resolveBackendUrl } from '@/lib/backend-url';

const FORWARDED_RESPONSE_HEADERS = [
  'content-type',
  'retry-after',
  'www-authenticate',
  'x-request-id'
] as const;

type Fetch = typeof fetch;
const MAX_API_BODY_BYTES = 1024 * 1024;
const MAX_NOTE_UPLOAD_BYTES = 64 * 1024 * 1024;
const BACKEND_TIMEOUT_MS = 120_000;

export async function forwardBackendRequest({
  request,
  path,
  accessToken,
  backendBaseUrl,
  fetchImpl = fetch
}: {
  request: Request;
  path: string[];
  accessToken?: string;
  backendBaseUrl: string;
  fetchImpl?: Fetch;
}) {
  if (!path.length || path.some((segment) => !/^[a-z0-9_-]+$/i.test(segment))) {
    return Response.json({ message: 'Invalid backend path' }, { status: 400 });
  }

  let targetUrl: URL;

  try {
    targetUrl = resolveBackendUrl(backendBaseUrl, path.join('/'));
  } catch {
    return Response.json({ message: 'Backend URL is not configured correctly' }, { status: 500 });
  }

  const sourceUrl = new URL(request.url);
  sourceUrl.searchParams.forEach((value, key) => targetUrl.searchParams.append(key, value));

  const headers = new Headers();
  headers.set('accept', 'application/json');
  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('content-type', contentType);

  if (accessToken) headers.set('authorization', `Bearer ${accessToken}`);

  const rawUpload =
    !!accessToken && request.method === 'PUT' && path.length === 2 && path[0] === 'uploads';
  const limit = rawUpload ? MAX_NOTE_UPLOAD_BYTES : MAX_API_BODY_BYTES;
  const contentLength = request.headers.get('content-length');
  if (
    contentLength !== null &&
    (!/^\d+$/.test(contentLength) || !Number.isSafeInteger(Number(contentLength)))
  ) {
    return Response.json({ message: 'Invalid request size' }, { status: 400 });
  }
  if (contentLength !== null && Number(contentLength) > limit) {
    return Response.json({ message: 'Request body too large' }, { status: 413 });
  }
  if (rawUpload) {
    if (contentLength === null) {
      return Response.json({ message: 'Upload length required' }, { status: 411 });
    }
    headers.set('content-length', contentLength);
  }

  let tooLarge = false;
  let bytesRead = 0;
  const body = request.body?.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        bytesRead += chunk.byteLength;
        if (bytesRead > limit) {
          tooLarge = true;
          controller.error(new Error('Request body too large'));
          return;
        }
        controller.enqueue(chunk);
      }
    })
  );
  const upstreamOptions = {
    method: request.method,
    headers,
    body,
    duplex: 'half' as const,
    cache: 'no-store' as const,
    redirect: 'error' as const,
    signal: AbortSignal.any([request.signal, AbortSignal.timeout(BACKEND_TIMEOUT_MS)])
  };

  try {
    const upstreamResponse = await fetchImpl(targetUrl.toString(), upstreamOptions);
    const responseHeaders = new Headers({ 'cache-control': 'private, no-store' });

    for (const header of FORWARDED_RESPONSE_HEADERS) {
      const value = upstreamResponse.headers.get(header);
      if (value) responseHeaders.set(header, value);
    }

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      headers: responseHeaders
    });
  } catch {
    if (tooLarge) return Response.json({ message: 'Request body too large' }, { status: 413 });
    return Response.json({ message: 'Backend request failed' }, { status: 502 });
  }
}
