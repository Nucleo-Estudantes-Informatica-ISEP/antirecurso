import { describe, expect, it, vi } from 'vitest';
import { apiFetch, apiRequest, ApiResponseError } from './apiClient';

describe('API client', () => {
  it('routes authenticated browser requests through the BFF without forwarding a token', async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => Response.json({ ok: true }));

    await apiRequest(
      '/notes/12/view',
      {
        authenticated: true,
        method: 'POST',
        headers: { Authorization: 'Bearer browser-session' }
      },
      fetchMock
    );

    expect(fetchMock).toHaveBeenCalledWith('/api/protected/notes/12/view', {
      method: 'POST',
      headers: expect.any(Headers),
      body: undefined,
      credentials: 'same-origin'
    });
    const headers = fetchMock.mock.calls[0][1]?.headers as Headers;
    expect(headers.has('authorization')).toBe(false);
  });

  it('serializes request JSON and parses response JSON', async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => Response.json({ id: 7 }));

    await expect(
      apiRequest<{ id: number }>('events', { method: 'POST', json: { name: 'SINF' } }, fetchMock)
    ).resolves.toEqual({ id: 7 });

    const init = fetchMock.mock.calls[0][1];
    expect(init?.body).toBe('{"name":"SINF"}');
    expect((init?.headers as Headers).get('content-type')).toBe('application/json');
  });

  it('adds access tokens only for server-side backend requests', async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => Response.json({ ok: true }));

    await apiFetch('user', { authenticated: true, accessToken: 'authnei-token' }, fetchMock);

    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toMatch(/\/user$/);
    expect(String(url)).not.toContain('/api/protected/');
    expect((init?.headers as Headers).get('authorization')).toBe('Bearer authnei-token');
  });

  it.each([401, 403, 503])('preserves HTTP %s error details', async (status) => {
    const fetchMock = vi.fn<typeof fetch>(async () =>
      Response.json(
        { message: 'Request failed', detail: 'Try later', requires_account_resolution: true },
        { status, headers: { 'x-request-id': 'request-77' } }
      )
    );

    const error = await apiRequest('user', {}, fetchMock).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ApiResponseError);
    expect(error).toMatchObject({
      status,
      backendMessage: 'Request failed: Try later',
      requestId: 'request-77',
      accountResolutionRequired: true
    });
  });

  it('passes cancellation signals to fetch', async () => {
    const controller = new AbortController();
    const fetchMock = vi.fn<typeof fetch>(async () => Response.json({ ok: true }));

    await apiFetch('subjects', { signal: controller.signal }, fetchMock);

    expect(fetchMock.mock.calls[0][1]?.signal).toBe(controller.signal);
  });

  it('normalizes network failures', async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => {
      throw new TypeError('connection refused');
    });

    await expect(apiRequest('subjects', {}, fetchMock)).rejects.toMatchObject({
      status: 0,
      backendMessage: 'connection refused'
    });
  });
});
