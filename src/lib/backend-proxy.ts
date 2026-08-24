const FORWARDED_RESPONSE_HEADERS = [
  'content-type',
  'retry-after',
  'www-authenticate',
  'x-request-id'
] as const;

type Fetch = typeof fetch;

export async function forwardAuthenticatedBackendRequest({
  request,
  path,
  accessToken,
  backendBaseUrl,
  fetchImpl = fetch
}: {
  request: Request;
  path: string[];
  accessToken: string;
  backendBaseUrl: string;
  fetchImpl?: Fetch;
}) {
  let targetUrl: URL;

  try {
    const normalizedBaseUrl = backendBaseUrl.endsWith('/') ? backendBaseUrl : `${backendBaseUrl}/`;
    targetUrl = new URL(path.map(encodeURIComponent).join('/'), normalizedBaseUrl);
  } catch {
    return Response.json(
      { message: 'Protected backend URL is not configured correctly' },
      { status: 500 }
    );
  }

  const sourceUrl = new URL(request.url);
  sourceUrl.searchParams.forEach((value, key) => targetUrl.searchParams.append(key, value));

  const headers = new Headers();
  headers.set('accept', request.headers.get('accept') ?? 'application/json');
  headers.set('authorization', `Bearer ${accessToken}`);

  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('content-type', contentType);

  const body =
    request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.text();

  try {
    const upstreamResponse = await fetchImpl(targetUrl, {
      method: request.method,
      headers,
      body,
      cache: 'no-store'
    });
    const responseHeaders = new Headers();

    for (const header of FORWARDED_RESPONSE_HEADERS) {
      const value = upstreamResponse.headers.get(header);
      if (value) responseHeaders.set(header, value);
    }

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      headers: responseHeaders
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Unknown network failure';
    return Response.json({ message: 'Protected backend request failed', detail }, { status: 502 });
  }
}
