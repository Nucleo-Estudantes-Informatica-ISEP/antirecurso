import { apiRequest } from '@/services/apiClient';

export const fetcher = <T>(url: string, token: string | null) =>
  apiRequest<T>(url, { authenticated: Boolean(token) });
