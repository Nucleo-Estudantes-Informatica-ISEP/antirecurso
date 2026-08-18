export const ACCESS_TOKEN_REFRESH_WINDOW_MS = 60_000;

export function shouldRefreshAccessToken(expiresAt: number | undefined, now = Date.now()): boolean {
  return (
    typeof expiresAt === 'number' &&
    Number.isFinite(expiresAt) &&
    now >= expiresAt - ACCESS_TOKEN_REFRESH_WINDOW_MS
  );
}
