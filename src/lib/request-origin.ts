export function isSameOriginRequest(request: Request) {
  const configuredUrl = process.env.NEXTAUTH_URL;
  if (!configuredUrl && process.env.NODE_ENV === 'production') return false;

  try {
    const appUrl = new URL(configuredUrl ?? request.url);
    return (
      ['https:', 'http:'].includes(appUrl.protocol) &&
      request.headers.get('origin') === appUrl.origin
    );
  } catch {
    return false;
  }
}
