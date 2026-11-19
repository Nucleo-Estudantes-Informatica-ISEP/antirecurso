import { describe, expect, it, vi } from 'vitest';
import { forwardBackendRequest } from './backend-proxy';

describe('backend proxy', () => {
  it('rejects a path outside the API segment format before contacting Adonis', async () => {
    const fetchMock = vi.fn<typeof fetch>();
    const response = await forwardBackendRequest({
      request: new Request('https://web.test/api/public/subjects'),
      path: ['not an endpoint'],
      backendBaseUrl: 'https://api.test/api/backend',
      fetchImpl: fetchMock
    });

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('forwards public requests without browser credentials', async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => Response.json([]));
    const response = await forwardBackendRequest({
      request: new Request('https://web.test/api/public/subjects?page=2', {
        headers: { authorization: 'Bearer client-token', cookie: 'session=client-cookie' }
      }),
      path: ['subjects'],
      backendBaseUrl: 'https://api.test/api/backend',
      fetchImpl: fetchMock
    });

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toBe('https://api.test/api/backend/subjects?page=2');
    expect(new Headers(init?.headers).has('authorization')).toBe(false);
    expect(new Headers(init?.headers).has('cookie')).toBe(false);
  });

  it('forwards PDF bytes unchanged', async () => {
    const bytes = new Uint8Array([37, 80, 68, 70, 45, 0, 255]);
    const fetchMock = vi.fn<typeof fetch>(async (_url, init) => {
      expect(new Headers(init?.headers).get('content-length')).toBe(String(bytes.length));
      expect(new Uint8Array(await new Response(init?.body).arrayBuffer())).toEqual(bytes);
      return new Response(null, { status: 204 });
    });
    const response = await forwardBackendRequest({
      request: new Request('https://web.test/api/protected/uploads/file-id', {
        method: 'PUT',
        headers: { 'content-type': 'application/pdf', 'content-length': String(bytes.length) },
        body: bytes
      }),
      path: ['uploads', 'file-id'],
      accessToken: 'valid-token',
      backendBaseUrl: 'https://api.test',
      fetchImpl: fetchMock
    });
    expect(response.status).toBe(204);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('rejects an oversized declared request before forwarding', async () => {
    const fetchMock = vi.fn<typeof fetch>();
    const response = await forwardBackendRequest({
      request: new Request('https://web.test/api/public/exams/verify', {
        method: 'POST',
        headers: { 'content-length': '1048577' }
      }),
      path: ['exams', 'verify'],
      backendBaseUrl: 'https://api.test',
      fetchImpl: fetchMock
    });
    expect(response.status).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('limits streamed requests without a declared size', async () => {
    const response = await forwardBackendRequest({
      request: new Request('https://web.test/api/public/exams/verify', {
        method: 'POST',
        body: 'a'.repeat(1024 * 1024 + 1)
      }),
      path: ['exams', 'verify'],
      backendBaseUrl: 'https://api.test',
      fetchImpl: async (_url, init) => {
        await new Response(init?.body).arrayBuffer();
        return Response.json({});
      }
    });
    expect(response.status).toBe(413);
  });

  it('replaces any browser marker with the AuthNEI access token', async () => {
    const fetchMock = vi.fn<typeof fetch>(async () =>
      Response.json(
        { message: 'accepted' },
        { status: 202, headers: { 'x-request-id': 'request-136' } }
      )
    );
    const request = new Request(
      'https://antirecurso.nei-isep.org/api/protected/exams/generate/17?mode=hard',
      { headers: { authorization: 'Bearer server-session' } }
    );

    const response = await forwardBackendRequest({
      request,
      path: ['exams', 'generate', '17'],
      accessToken: 'authnei-access-token',
      backendBaseUrl: 'https://antirecurso.nei-isep.org/api/backend',
      fetchImpl: fetchMock
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toBe(
      'https://antirecurso.nei-isep.org/api/backend/exams/generate/17?mode=hard'
    );
    expect(new Headers(init?.headers).get('authorization')).toBe('Bearer authnei-access-token');
    expect(init?.redirect).toBe('error');
    expect(response.status).toBe(202);
    expect(response.headers.get('cache-control')).toBe('private, no-store');
    expect(response.headers.get('x-request-id')).toBe('request-136');
    await expect(response.json()).resolves.toEqual({ message: 'accepted' });
  });

  it('preserves backend status and error details', async () => {
    const response = await forwardBackendRequest({
      request: new Request('https://web.test/api/protected/notes/9/view', { method: 'POST' }),
      path: ['notes', '9', 'view'],
      accessToken: 'valid-token',
      backendBaseUrl: 'https://api.test/api/backend',
      fetchImpl: vi.fn<typeof fetch>(async () =>
        Response.json(
          { message: 'Account resolution required', requires_account_resolution: true },
          { status: 403 }
        )
      )
    });

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      message: 'Account resolution required',
      requires_account_resolution: true
    });
  });

  it('returns a generic gateway response when Adonis is unreachable', async () => {
    const response = await forwardBackendRequest({
      request: new Request('https://web.test/api/protected/exams'),
      path: ['exams'],
      accessToken: 'valid-token',
      backendBaseUrl: 'https://api.test/api/backend',
      fetchImpl: vi.fn<typeof fetch>(async () => {
        throw new Error('connection refused');
      })
    });

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({
      message: 'Backend request failed'
    });
  });
});
