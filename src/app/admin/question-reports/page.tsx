"use client";

import useSWR, { mutate } from 'swr';
import { fetcher } from '@/utils/SWRFetcher';
import { BASE_URL } from 'src/services/api';
import useSession from '@/hooks/useSession';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { useQueryParamsManager } from '@/hooks/useQueryParamsManager';
import swal from 'sweetalert';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import ReportTable from '@/components/ReportTable';

const Reports: React.FC = () => {

  const { theme } = useTheme();
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

  // logic
  const [filterAll, setFilterAll] = useState<boolean>(true);
  const [filterSolved, setFilterSolved] = useState<boolean>(false);
  const [selectedReports, setSelectedReports] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<{ key: string; desc: boolean }>({
    key: 'created_at',
    desc: true
  });

  // solve reports
  const handleMarkAsResolve = async () => {
    if (selectedReports.length === 0) return;

    const res = await fetch(BASE_URL + '/question-reports/review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.token}`
      },
      body: JSON.stringify({
        question_ids: selectedReports,
      })
    });

    if (res.status === 200) {

      // revalidate data
      mutate([endpoint, session.token as string]);

      swal({
        title: 'Resolvido!',
        text: `${selectedReports.length > 1 ? 'Os reports foram marcados como resolvidos' : 'O report foi marcado como resolvido'}.`,
        icon: 'success',
        className: theme === 'dark' ? 'swal-dark' : '',
        timer: 2000
      });

    }
    else {
      swal({
        title: 'Erro!',
        text: 'Algo correu mal ao marcar o(s) teu(s) report(s). Por favor, tenta novamente.',
        icon: 'error',
        className: theme === 'dark' ? 'swal-dark' : ''
      });
    }
  };

  const handleActionCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, action: string) => {

    // update the query parameter
    if (action === "solved") {
      // add the "solved" query parameter
      searchParams.set('solved', e.target.checked ? 'true' : 'false')
      setFilterAll(false);
      setFilterSolved(e.target.checked);
    } else {
      // remove the "solved" query parameter
      searchParams.remove('solved')
      setFilterAll(e.target.checked);
      setFilterSolved(false);
    }
  }

  // when sortBy changes, update endpoint and revalidate data
  useEffect(() => {
    // append sort query params to endpoint
    searchParams.setBulk({
      sort: sortBy.key,
      order: sortBy.desc ? 'desc' : 'asc'
    });
  }, [sortBy]);

  // when search params change, update endpoint
  useEffect(() => {
    setEndpoint(`${BASE_URL}/question-reports?${searchParams.queryParams}`);

    // mutate([endpoint, session.token as string]);
  }, [searchParams.queryParams]);

  // on mount get the query params from the url
  useEffect(() => {
    searchParams.setQueryParams(new URLSearchParams(window.location.search));
    
    // set the filter checkboxes
    const solved = searchParams.queryParams.get('solved');
    if (solved) {
      setFilterAll(false);
      setFilterSolved(solved === 'true');
    }

    // set the sort by and order
    const sort = searchParams.queryParams.get('sort');
    const order = searchParams.queryParams.get('order');
    if (sort && order) {
      setSortBy({ key: sort, desc: order === 'desc' });
    }else{
      setSortBy({ key: 'created_at', desc: true });
    }
  }, []);

  return (
    <div className="w-full h-full mt-4 flex flex-col items-center justify-center">
      <h2 className="text-4xl font-black">Reports</h2>
      <div className="w-3/4 flex gap-6 my-4 border bg-gray-400 dark:bg-gray-700 items-center justify-center">
        <input
          type="checkbox"
          name="all"
          id="all"
          checked={filterAll}
          onChange={(e) => handleActionCheckboxChange(e, "all")}
        />
        <label htmlFor="all" className="text-white">
          Todos
        </label>
        <input
          type="checkbox"
          name="solved"
          id="solved"
          checked={filterSolved}
          onChange={(e) => handleActionCheckboxChange(e, "solved")}
        />
        <label htmlFor="solved" className="text-white">
          Resolvido
        </label>
      </div>
      <div className="flex gap-x-2">
        <button
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md shadow-md"
          onClick={handleMarkAsResolve}
        >
          Resolver
        </button>
      </div>
      <div className="flex flex-col w-3/4">
        {isLoading ? (<Skeleton count={5} />)
          : error ? (
            <div className="w-full h-full mt-4 flex flex-col items-center justify-center">
              <h1 className="text-2xl font-bold">Erro ao carregar reports</h1>
              <p className="text-lg">Por favor, tente novamente mais tarde.</p>
            </div>
          ) :
            (<ReportTable
              reports={data ?? []}
              selectedReports={selectedReports}
              setSelectedReports={setSelectedReports}
              sortBy={sortBy}
              setSortBy={setSortBy} />)
        }

      </div>
    </div>
  );
};

export default Reports;