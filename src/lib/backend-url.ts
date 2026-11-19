export function resolveBackendUrl(baseUrl: string, path: string) {
  const queryIndex = path.indexOf('?');
  const pathname = queryIndex === -1 ? path : path.slice(0, queryIndex);
  const relative = pathname.replace(/^\//, '');
  if (relative.split('/').some((segment) => !/^[a-z0-9_-]+$/i.test(segment))) {
    throw new TypeError('Invalid backend path');
  }

  const base = new URL(baseUrl);
  if (
    !['http:', 'https:'].includes(base.protocol) ||
    base.username ||
    base.password ||
    base.search ||
    base.hash
  ) {
    throw new TypeError('Invalid backend configuration');
  }

  base.pathname = `${base.pathname.replace(/\/+$/, '')}/${relative}`;
  if (queryIndex !== -1) base.search = path.slice(queryIndex);
  return base;
}
