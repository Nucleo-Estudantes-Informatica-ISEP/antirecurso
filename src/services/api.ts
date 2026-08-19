export const PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? '/api/backend';
export const SERVER_API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:3333';

export const BASE_URL =
  typeof window === 'undefined' ? SERVER_API_BASE_URL : PUBLIC_API_BASE_URL;

export const PROTECTED_API_BASE_URL =
  process.env.NEXT_PUBLIC_PROTECTED_API_BASE_URL ?? '/api/protected';
