import { describe, expect, it, vi } from 'vitest';
import {
  authenticatedBackendFetch,
  BackendResponseError,
  throwBackendResponseError
} from './authenticatedBackend';

describe('authenticated backend requests', () => {
  it('always uses the same-origin protected BFF and never forwards the session marker', async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => Response.json({ ok: true }));

    await authenticatedBackendFetch(
      '/notes/12/view',
      { method: 'POST', headers: { Authorization: 'Bearer server-session' } },
      fetchMock
    );

    expect(fetchMock).toHaveBeenCalledWith('/api/protected/notes/12/view', {
      method: 'POST',
      headers: expect.any(Headers),
      credentials: 'same-origin'
    });
    const headers = fetchMock.mock.calls[0][1]?.headers as Headers;
    expect(headers.has('authorization')).toBe(false);
  });

  it('keeps the backend status, message, and request id', async () => {
    const response = Response.json(
      { message: 'Token audience mismatch' },
      { status: 401, headers: { 'x-request-id': 'request-77' } }
    );

    const error = await throwBackendResponseError(response, 'Unable to load exam').catch(
      (caught: unknown) => caught
    );

    expect(error).toBeInstanceOf(BackendResponseError);
    expect(error).toMatchObject({
      status: 401,
      backendMessage: 'Token audience mismatch',
      requestId: 'request-77'
    });
  });

  it('includes gateway detail in the actionable error', async () => {
    const response = Response.json(
      { message: 'Protected backend request failed', detail: 'connection refused' },
      { status: 502 }
    );

    await expect(throwBackendResponseError(response, 'Unable to load exam')).rejects.toMatchObject({
      status: 502,
      backendMessage: 'Protected backend request failed: connection refused'
    });
  });
});
