import { afterEach, describe, expect, it, vi } from 'vitest';
import generateExam from './generateExam';

describe('exam generation request path', () => {
  afterEach(() => vi.unstubAllGlobals());

  it.each(['default', 'realistic', 'new', 'wrong', 'hard', 'custom'])(
    'uses the authenticated BFF for signed-in %s mode',
    async (mode) => {
      const fetchMock = vi.fn<typeof fetch>(async () => Response.json([{ id: 1 }]));
      vi.stubGlobal('fetch', fetchMock);

      await generateExam(17, mode, 'server-session', mode === 'custom' ? 10 : undefined);

      expect(fetchMock).toHaveBeenCalledOnce();
      const [url, init] = fetchMock.mock.calls[0];
      expect(String(url)).toMatch(new RegExp(`^/api/protected/exams/generate/17\\?mode=${mode}`));
      expect(new Headers(init?.headers).has('authorization')).toBe(false);
      expect(init?.credentials).toBe('same-origin');
    }
  );

  it('keeps anonymous default mode on the public backend path', async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => Response.json([{ id: 1 }]));
    vi.stubGlobal('fetch', fetchMock);

    await generateExam(17, 'default', null);

    expect(String(fetchMock.mock.calls[0][0])).not.toContain('/api/protected/');
  });

  it('throws the backend status and message instead of returning a generic null', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Response.json(
          { message: 'Token audience mismatch' },
          { status: 401, headers: { 'x-request-id': 'auth-smoke' } }
        )
      )
    );

    await expect(generateExam(17, 'hard', 'server-session')).rejects.toMatchObject({
      status: 401,
      backendMessage: 'Token audience mismatch',
      requestId: 'auth-smoke'
    });
  });
});
