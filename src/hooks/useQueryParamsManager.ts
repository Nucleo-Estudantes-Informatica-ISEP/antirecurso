/* eslint-disable @typescript-eslint/no-explicit-any */
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export const useQueryParamsManager = () => {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [queryParams, setQueryParams] = useState<URLSearchParams>(searchParams);

  // if exists, update, else add
  // eslint-disable-next-line
  const set = (key: string, value: any) => {
    const params = new URLSearchParams(queryParams.toString());
    params.set(key, value);
    setQueryParams(params);
  };

  const setBulk = (params: { [key: string]: any }) => {
    const paramsObj = new URLSearchParams(queryParams.toString());
    Object.keys(params).forEach((key) => {
      paramsObj.set(key, params[key]);
    });
    setQueryParams(paramsObj);
  };

  const remove = (key: string) => {
    const params = new URLSearchParams(queryParams.toString());
    params.delete(key);
    setQueryParams(params);
  };

  const clear = () => {
    const params = new URLSearchParams(queryParams.toString());
    params.forEach((_, key) => {
      params.delete(key);
    });
    setQueryParams(params);
  };

  // update url
  useEffect(() => {
    replace(`${pathname}?${queryParams.toString()}`);
  }, [queryParams]);

  // on mount, set query params
  useEffect(() => {
    setQueryParams(new URLSearchParams(searchParams));
  }, []);

  return {
    queryParams,
    set,
    setBulk,
    remove,
    clear
  };
};
