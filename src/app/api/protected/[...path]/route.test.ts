import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from './route';
import { getApiAccessToken } from '@/lib/server-auth';
import { forwardBackendRequest } from '@/lib/backend-proxy';

vi.mock('@/lib/server-auth', () => ({ getApiAccessToken: vi.fn() }));
vi.mock('@/lib/backend-proxy', () => ({ forwardBackendRequest: vi.fn() }));

describe('protected BFF browser requests', () => {
  const params = { params: Promise.resolve({ path: ['exams', 'generate', '17'] }) };
  const url = 'https://web.test/api/protected/exams/generate/17';

  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv('NEXTAUTH_URL', 'https://web.test');
  });

  afterEach(() => vi.unstubAllEnvs());

  it.each(['https://outside.test', null])(
    'rejects a mutation from origin %s before reading cookies',
    async (origin) => {
      const request = new NextRequest(url, {
        method: 'POST',
        headers: origin ? { origin } : undefined
      });
      expect((await POST(request, params)).status).toBe(403);
      expect(getApiAccessToken).not.toHaveBeenCalled();
      expect(forwardBackendRequest).not.toHaveBeenCalled();
    }
  );

  it('permits only same-origin POST for authenticated exam generation', async () => {
    vi.mocked(getApiAccessToken).mockResolvedValue('fixture-token');
    vi.mocked(forwardBackendRequest).mockResolvedValue(Response.json([]));
    const request = new NextRequest(url, {
      method: 'POST',
      headers: { origin: 'https://web.test' }
    });
    expect((await POST(request, params)).status).toBe(200);
    expect((await GET(new NextRequest(url), params)).status).toBe(405);
    expect(forwardBackendRequest).toHaveBeenCalledOnce();
  });
});
