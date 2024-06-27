'use client';

import { usePathname, useSearchParams } from 'next/navigation';

const useCallbackUrl = (): string => {
  const omittedPathnames = ['/login', '/register'];
  const path = decodeURI(usePathname());
  const callbackUrl = useSearchParams().get('callbackUrl');

  const isInOmittedPaths = (value: string): boolean => {
    return omittedPathnames.find((item) => item === value) ? true : false;
  };

  if (callbackUrl && !isInOmittedPaths(callbackUrl)) return encodeURI(callbackUrl);

  if (path.length === 0 || isInOmittedPaths(path)) return encodeURI('/');

  return encodeURI(path);
};

export default useCallbackUrl;
