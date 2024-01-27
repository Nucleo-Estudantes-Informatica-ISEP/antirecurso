"use client";

import useSWR, { mutate } from 'swr';
import { fetcher } from '@/utils/SWRFetcher';
import { BASE_URL } from 'src/services/api';
import useSession from '@/hooks/useSession';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import swal from 'sweetalert';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import ReportTable from '@/components/ReportTable';

const Reports: React.FC = () => {

  const { theme } = useTheme();
  const session = useSession();
  const [endpoint, setEndpoint] = useState<string>(`${BASE_URL}/question-reports`);
  // conditional data fetching https://swr.vercel.app/docs/conditional-fetching
  const { data, error, isLoading } = useSWR(
    session.token ? [endpoint, session.token as string] : null,
    ([url, token]) => fetcher(url, token)
  );

  // logic
  const [selectedReports, setSelectedReports] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<{ key: string; desc: boolean }>({
    key: 'created_at',
    desc: true
  });

  // solve reports
  const handleMarkAsResolve = async () => {

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

  // delete reports
  const handleDelete = async () => {
    if (selectedReports.length === 0) return;
  };

  // when sortBy changes, update endpoint and revalidate data
  useEffect(() => {
    setEndpoint(`${BASE_URL}/question-reports?sort=${sortBy.key}&desc=${sortBy.desc}`);
    mutate([endpoint, session.token as string]);
  }, [sortBy]);

  return (
    <div className="w-full h-full mt-4 flex flex-col items-center justify-center">
      <h2 className="text-4xl font-black">Reports</h2>
      <div className="flex gap-x-2">
        <button
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md shadow-md"
          onClick={handleMarkAsResolve}
        >
          Resolver
        </button>
        <button className="bg-red-500 hover:bg-red-500 text-white px-4 py-2 rounded-md shadow-md"
          onClick={handleDelete}
        >
          Apagar
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
