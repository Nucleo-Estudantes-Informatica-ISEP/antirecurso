import { apiFetch } from '@/services/apiClient';

const FORWARDED_RESPONSE_HEADERS = [
  'content-type',
  'retry-after',
  'www-authenticate',
  'x-request-id'
] as const;

type Fetch = typeof fetch;

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
    const normalizedBaseUrl = backendBaseUrl.endsWith('/') ? backendBaseUrl : `${backendBaseUrl}/`;
    targetUrl = new URL(path.join('/'), normalizedBaseUrl);
    if (!['https:', 'http:'].includes(targetUrl.protocol)) throw new Error();
  } catch {
    return Response.json(
      { message: 'Backend URL is not configured correctly' },
      { status: 500 }
    );
  }

  const sourceUrl = new URL(request.url);
  sourceUrl.searchParams.forEach((value, key) => targetUrl.searchParams.append(key, value));

  const headers = new Headers();
  headers.set('accept', 'application/json');
  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('content-type', contentType);

  const body =
    request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.arrayBuffer();

  try {
    const upstreamResponse = await apiFetch(
      targetUrl.toString(),
      {
        accessToken,
        method: request.method,
        headers,
        body,
        cache: 'no-store',
        redirect: 'error'
      },
      fetchImpl
    );
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
    return Response.json({ message: 'Backend request failed' }, { status: 502 });
  }
}
