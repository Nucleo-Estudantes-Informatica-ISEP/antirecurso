import { describe, expect, it, vi } from 'vitest';
import { forwardAuthenticatedBackendRequest } from './backend-proxy';

describe('authenticated backend proxy', () => {
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

    const response = await forwardAuthenticatedBackendRequest({
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
    expect(response.status).toBe(202);
    expect(response.headers.get('x-request-id')).toBe('request-136');
    await expect(response.json()).resolves.toEqual({ message: 'accepted' });
  });

  it('preserves backend status and error details', async () => {
    const response = await forwardAuthenticatedBackendRequest({
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

  it('returns an actionable gateway response when Adonis is unreachable', async () => {
    const response = await forwardAuthenticatedBackendRequest({
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
      message: 'Protected backend request failed',
      detail: 'connection refused'
    });
  });
});
