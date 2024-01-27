import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

export const useQueryParamsManager = () => {
    const { replace } = useRouter();
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [queryParams, setQueryParams] = useState<URLSearchParams>(searchParams);

    // if exists, update, else add
    const set = (key: string, value: any) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set(key, value);
        setQueryParams(params);;
    }

    const setBulk = (params: { [key: string]: any }) => {
        const paramsObj = new URLSearchParams(searchParams.toString())
        Object.keys(params).forEach(key => {
            paramsObj.set(key, params[key]);
        })
        setQueryParams(paramsObj);;
    }

    const remove = (key: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.delete(key);
        setQueryParams(params);
    }

    const clear = () => {
        const params = new URLSearchParams(searchParams.toString())
        params.forEach((_, key) => {
            params.delete(key);
        })
        setQueryParams(params);
    }

    useEffect(() => {
        replace(`${pathname}?${queryParams.toString()}`);
    }, [queryParams])

    return {
        queryParams,
        setQueryParams,
        set,
        setBulk,
        remove,
        clear
    }
}
