import { PROTECTED_API_BASE_URL } from './api';

export const AUTHENTICATED_BACKEND_PATH = PROTECTED_API_BASE_URL;

export class BackendResponseError extends Error {
  constructor(
    public readonly status: number,
    public readonly backendMessage: string,
    public readonly requestId?: string
  ) {
    super(
      `Backend request failed with HTTP ${status}: ${backendMessage}${requestId ? ` (request ${requestId})` : ''}`
    );
    this.name = 'BackendResponseError';
  }
}

export function authenticatedBackendFetch(
  path: string,
  init: RequestInit = {},
  fetchImpl: typeof fetch = fetch
) {
  const headers = new Headers(init.headers);
  headers.delete('authorization');

  return fetchImpl(`${AUTHENTICATED_BACKEND_PATH}/${path.replace(/^\/+/, '')}`, {
    ...init,
    headers,
    credentials: 'same-origin'
  });
}

export async function throwBackendResponseError(
  response: Response,
  fallbackMessage: string
): Promise<never> {
  const body = await response.text();
  let backendMessage = fallbackMessage;

  if (body) {
    try {
      const parsed = JSON.parse(body) as { detail?: unknown; error?: unknown; message?: unknown };
      const messages = [parsed.message, parsed.detail, parsed.error].filter(
        (value): value is string => typeof value === 'string' && value.length > 0
      );
      if (messages.length) backendMessage = Array.from(new Set(messages)).join(': ');
    } catch {
      backendMessage = body.slice(0, 500);
    }
  }

  throw new BackendResponseError(
    response.status,
    backendMessage,
    response.headers.get('x-request-id') ?? undefined
  );
}
