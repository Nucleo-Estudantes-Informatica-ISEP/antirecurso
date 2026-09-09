import { BASE_URL, PROTECTED_API_BASE_URL, SERVER_API_BASE_URL } from './api';

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  authenticated?: boolean;
  accessToken?: string;
  body?: BodyInit | null;
  errorMessage?: string;
  json?: unknown;
};

export class ApiResponseError extends Error {
  public readonly accountResolutionRequired: boolean;

  constructor(
    public readonly status: number,
    public readonly backendMessage: string,
    public readonly payload?: unknown,
    public readonly requestId?: string
  ) {
    super(
      `Backend request failed${status ? ` with HTTP ${status}` : ''}: ${backendMessage}${requestId ? ` (request ${requestId})` : ''}`
    );
    this.name = 'ApiResponseError';
    this.accountResolutionRequired =
      isRecord(payload) && payload.requires_account_resolution === true;
  }
}

export async function apiFetch(
  path: string,
  options: ApiRequestOptions = {},
  fetchImpl: typeof fetch = fetch
): Promise<Response> {
  const {
    accessToken,
    authenticated = false,
    body,
    errorMessage: _errorMessage,
    headers: initialHeaders,
    json,
    ...init
  } = options;
  void _errorMessage;

  if (body !== undefined && json !== undefined) {
    throw new TypeError('API request cannot include both body and json');
  }

  const headers = new Headers(initialHeaders);
  headers.set('accept', headers.get('accept') ?? 'application/json');

  if (accessToken) headers.set('authorization', `Bearer ${accessToken}`);
  else if (authenticated) headers.delete('authorization');

  if (json !== undefined) headers.set('content-type', 'application/json');

  const baseUrl = accessToken
    ? SERVER_API_BASE_URL
    : authenticated
      ? PROTECTED_API_BASE_URL
      : BASE_URL;

  return fetchImpl(resolveApiUrl(path, baseUrl), {
    ...init,
    headers,
    body: json === undefined ? body : JSON.stringify(json),
    ...(authenticated && !accessToken ? { credentials: 'same-origin' as const } : {})
  });
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
  fetchImpl: typeof fetch = fetch
): Promise<T> {
  let response: Response;

  try {
    response = await apiFetch(path, options, fetchImpl);
  } catch (error) {
    if (error instanceof ApiResponseError) throw error;
    throw new ApiResponseError(
      0,
      error instanceof Error ? error.message : 'Network request failed'
    );
  }

  if (!response.ok) {
    await throwApiResponseError(response, options.errorMessage ?? 'Backend request failed');
  }

  if (response.status === 204) return undefined as T;

  const body = await response.text();
  if (!body) return undefined as T;

  try {
    return JSON.parse(body) as T;
  } catch {
    if (response.headers.get('content-type')?.includes('json')) {
      throw new ApiResponseError(response.status, 'Backend returned invalid JSON', body);
    }
    return body as T;
  }
}

export async function throwApiResponseError(
  response: Response,
  fallbackMessage: string
): Promise<never> {
  const body = await response.text();
  let payload: unknown;

  if (body) {
    try {
      payload = JSON.parse(body);
    } catch {
      payload = body.slice(0, 500);
    }
  }

  throw new ApiResponseError(
    response.status,
    getBackendMessage(payload, fallbackMessage),
    payload,
    response.headers.get('x-request-id') ?? undefined
  );
}

function resolveApiUrl(path: string, baseUrl: string): string {
  if (/^https?:\/\//i.test(path)) return path;

  const normalizedBaseUrl = baseUrl.replace(/\/+$/, '');
  const normalizedPath = path.startsWith(normalizedBaseUrl)
    ? path.slice(normalizedBaseUrl.length)
    : path;
  return `${normalizedBaseUrl}/${normalizedPath.replace(/^\/+/, '')}`;
}

function getBackendMessage(payload: unknown, fallbackMessage: string): string {
  if (typeof payload === 'string' && payload) return payload;
  if (!isRecord(payload)) return fallbackMessage;

  const errorMessage = isRecord(payload.error) ? payload.error.message : payload.error;
  const messages = [payload.message, payload.detail, errorMessage].filter(
    (value): value is string => typeof value === 'string' && value.length > 0
  );
  return messages.length ? Array.from(new Set(messages)).join(': ') : fallbackMessage;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
