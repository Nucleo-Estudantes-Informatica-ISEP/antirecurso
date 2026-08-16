const SESSION_COOKIE_CHUNK_SIZE = 3933;

export type SessionCookieUpdate = {
  name: string;
  value: string;
  maxAge: number;
};

export function buildSessionCookieUpdates(
  existingCookieNames: string[],
  baseCookieName: string,
  encodedToken: string,
  maxAge: number
): SessionCookieUpdate[] {
  const expiredChunks = Array.from(new Set(existingCookieNames))
    .filter((name) => name === baseCookieName || name.startsWith(`${baseCookieName}.`))
    .map((name) => ({ name, value: '', maxAge: 0 }));

  const chunkCount = Math.ceil(encodedToken.length / SESSION_COOKIE_CHUNK_SIZE);
  const freshChunks = Array.from({ length: chunkCount }, (_, index) => ({
    name: chunkCount === 1 ? baseCookieName : `${baseCookieName}.${index}`,
    value: encodedToken.slice(
      index * SESSION_COOKIE_CHUNK_SIZE,
      (index + 1) * SESSION_COOKIE_CHUNK_SIZE
    ),
    maxAge
  }));

  return [...expiredChunks, ...freshChunks];
}
