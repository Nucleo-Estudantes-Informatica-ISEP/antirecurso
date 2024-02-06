'use client';

import { usePathname, useSearchParams } from 'next/navigation';

const useCallbackUrl = (): string => {
  const omittedPathnames = ['/login', '/register'];
  const path = decodeURI(usePathname());
  const callbackUrl = useSearchParams().get('callbackUrl');

  const isInOmitedPaths = (value: string): boolean => {
    return omittedPathnames.find((item) => item === value) ? true : false;
  };

  if (callbackUrl && !isInOmitedPaths(callbackUrl)) {
    return encodeURI(callbackUrl);
  }

  if (path.length === 0 || isInOmitedPaths(path)) {
    return encodeURI('/');
  }

  return encodeURI(path);
};

export default useCallbackUrl;
