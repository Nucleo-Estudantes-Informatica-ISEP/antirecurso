export const PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? '/api/backend';
export const SERVER_API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:3333';

export const BASE_URL = typeof window === 'undefined' ? SERVER_API_BASE_URL : PUBLIC_API_BASE_URL;

// Authenticated browser traffic must always pass through the same-origin Next BFF.
// Making this build-time configurable allowed production to point it at Adonis and
// send the opaque client session marker as though it were an AuthNEI access token.
export const PROTECTED_API_BASE_URL = '/api/protected';
