'use client';

import ReportTable from '@/components/admin/ReportTable';
import ReportModal from '@/components/exams/ReportModal';
import { useQueryParamsManager } from '@/hooks/useQueryParamsManager';
import useSession from '@/hooks/useSession';
import Report from '@/types/Report';
import { fetcher } from '@/utils/SWRFetcher';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { BASE_URL } from 'src/services/api';
import swal from 'sweetalert';
import useSWR, { mutate } from 'swr';

type Filter = {
  name: string;
  value: string;
};

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
  const filters = [
    {
      name: 'Todos',
      value: 'all'
    },
    {
      name: 'Resolvidos',
      value: 'solved'
    },
    {
      name: 'Não resolvidos',
      value: 'notSolved'
    }
  ];
  const [filter, setFilter] = useState<string>(filters[0].value);
  const [selectedReports, setSelectedReports] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<{ key: string; desc: boolean }>({
    key: 'created_at',
    desc: true
  });

  // modal
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportClicked, setReportClicked] = useState<Report | null>(null);

  // handle solve reports - optional param for calling the function from the modal
  const handleMarkAsResolve = async (reportId?: number) => {
    if (selectedReports.length === 0 && !reportId) return;

    const res = await fetch(BASE_URL + '/question-reports/review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.token}`
      },
      body: JSON.stringify({
        question_ids: reportId ? [reportId] : selectedReports
      })
    });

    if (res.status === 200) {
      // revalidate data
      revalidateReports();

      swal({
        title: 'Resolvido!',
        text: `${
          selectedReports.length > 1
            ? 'Os reports foram marcados como resolvidos'
            : 'O report foi marcado como resolvido'
        }.`,
        icon: 'success',
        className: theme === 'dark' ? 'swal-dark' : '',
        timer: 2000
      });
    } else {
      swal({
        title: 'Erro!',
        text: 'Algo correu mal ao marcar o(s) teu(s) report(s). Por favor, tenta novamente.',
        icon: 'error',
        className: theme === 'dark' ? 'swal-dark' : ''
      });
    }
  };

  const revalidateReports = () => {
    mutate([endpoint, session.token as string]);
  };

  // handle filter checkboxes
  const handleChangeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // update filter state
    setFilter(e.target.value);

    switch (e.target.value) {
      case 'all':
        searchParams.remove('solved');
        break;
      case 'solved':
        searchParams.set('solved', 'true');
        break;
      case 'notSolved':
        searchParams.set('solved', 'false');
        break;
      default:
        break;
    }
  };

  // handle reset filters
  const handleResetFilters = () => {
    searchParams.remove('solved');
    setFilter('all');
    setSortBy({ key: 'created_at', desc: true });
  };

  const handleOpenModal = (report: Report) => {
    setReportClicked(report);
    setIsReportModalOpen(true);
  };

  // when sortBy changes, update endpoint and revalidate data
  useEffect(() => {
    // append sort query params
    searchParams.setBulk({
      sort: sortBy.key,
      order: sortBy.desc ? 'desc' : 'asc'
    });
  }, [sortBy.key, sortBy.desc, searchParams]);

  // when search params change, update endpoint
  useEffect(() => {
    setEndpoint(`${BASE_URL}/question-reports?${searchParams.queryParams}`);
  }, [searchParams.queryParams]);

  // on mount set the filter checkboxes and sort by
  useEffect(() => {
    // set the filter checkboxes
    const solved = searchParams.queryParams.get('solved');
    if (solved) {
      setFilter(solved === 'true' ? 'solved' : 'notSolved');
    }

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
    <>
      <ReportModal
        setIsVisible={setIsReportModalOpen}
        isVisible={isReportModalOpen}
        report={reportClicked}
        solveReport={handleMarkAsResolve}
        revalidateReports={revalidateReports}
      />

      <div className="w-full h-full mt-4 flex flex-col items-center justify-center">
        <h2 className="text-4xl font-black">Reports</h2>
        <div className="w-3/4 py-2 flex gap-6 my-4 bg-gray-100 dark:bg-gray-700 items-center justify-center">
          <select
            id="filters"
            className="w-44 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(e) => handleChangeFilter(e)}
            value={filter}>
            {filters.map((f: Filter) => (
              <option key={f.value} value={f.value}>
                {f.name}
              </option>
            ))}
          </select>
          <button
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 shadow-md"
            onClick={() => handleResetFilters()}>
            Repor Filtros
          </button>
        </div>
        <div className="flex gap-x-2">
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 shadow-md"
            onClick={() => handleMarkAsResolve()}>
            Resolver
          </button>
        </div>
        <div className="flex flex-col w-3/4">
          {/* needs to be like this cuz data can be null while the session request is pending.
            TODO: implement SWR on session fetching and pass its isLoading to the context so it can be used as well*/}
          {isLoading || data === undefined || data === null ? (
            <Skeleton count={5} />
          ) : error ? (
            <div className="w-full h-full mt-4 flex flex-col items-center justify-center">
              <h1 className="text-2xl font-bold">Erro ao carregar reports</h1>
              <p className="text-lg">Por favor, tente novamente mais tarde.</p>
            </div>
          ) : (
            <ReportTable
              reports={data ?? []}
              selectedReports={selectedReports}
              setSelectedReports={setSelectedReports}
              sortBy={sortBy}
              setSortBy={setSortBy}
              handleOpenModal={handleOpenModal}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Reports;
