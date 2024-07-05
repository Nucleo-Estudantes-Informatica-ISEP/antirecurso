'use client';

import CommentTable from '@/components/admin/CommentTable';
import { useQueryParamsManager } from '@/hooks/useQueryParamsManager';
import useSession from '@/hooks/useSession';
import { BASE_URL } from '@/services/api';
import { fetcher } from '@/utils/SWRFetcher';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import useSWR from 'swr';

const Comments: React.FC = () => {
  const session = useSession();

  // search params
  const searchParams = useQueryParamsManager();

  const [endpoint, setEndpoint] = useState<string | null>(null);

  // conditional data fetching https://swr.vercel.app/docs/conditional-fetching
  const { data, error, isLoading } = useSWR(
    session.token && endpoint ? [endpoint, session.token as string] : null,
    ([url, token]) => fetcher(url, token),
    { revalidateOnFocus: false }
  );

  const [sortBy, setSortBy] = useState<{ key: string; desc: boolean }>({
    key: 'created_at',
    desc: true
  });
  const [selectedComments, setSelectedComments] = useState<number[]>([]);

  // handle reset filters
  const handleResetFilters = () => {
    setSortBy({ key: 'created_at', desc: true });
  };

  // when sortBy changes, update endpoint and revalidate data
  useEffect(() => {
    // append sort query params
    searchParams.setBulk({
      sort: sortBy.key,
      order: sortBy.desc ? 'desc' : 'asc'
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy.key, sortBy.desc]);

  // when search params change, update endpoint
  useEffect(() => {
    setEndpoint(`${BASE_URL}/comments?${searchParams.queryParams}`);
  }, [searchParams.queryParams]);

  // on mount set the filter checkboxes and sort by
  useEffect(() => {
    // set the sort by and order
    const sort = searchParams.queryParams.get('sort');
    const order = searchParams.queryParams.get('order');

    if (sort && order) {
      setSortBy({ key: sort, desc: order === 'desc' });
    } else {
      setSortBy({ key: 'created_at', desc: true });
    }
  }, [searchParams.queryParams]);

  return (
    <div className="w-full h-full mt-4 flex flex-col items-center justify-center">
      <h2 className="text-4xl font-black">Comentários</h2>
      <div className="w-3/4 py-2 flex gap-6 my-4 bg-gray-100 dark:bg-gray-700 items-center justify-center">
        <button
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 shadow-md"
          onClick={() => handleResetFilters()}>
          Repor Filtros
        </button>
      </div>
      <div className="flex flex-col w-3/4">
        {/* needs to be like this cuz data can be null while the session request is pending.
            TODO: implement SWR on session fetching and pass its isLoading to the context so it can be used as well*/}
        {isLoading || data === undefined || data === null ? (
          <Skeleton count={5} />
        ) : error ? (
          <div className="w-full h-full mt-4 flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold">Erro ao carregar comentários</h1>
            <p className="text-lg">Por favor, tente novamente mais tarde.</p>
          </div>
        ) : (
          <CommentTable
            data={data ?? []}
            selected={selectedComments}
            setSelected={setSelectedComments}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        )}
      </div>
    </div>
  );
};

export default Comments;
