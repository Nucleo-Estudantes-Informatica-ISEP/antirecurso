'use client';

import ExamsTable from '@/components/exams/ExamsTable';
import ExamTableLoading from '@/components/exams/ExamsTableLoading';
import Pagination from '@/components/utils/Pagination';
import Answer from '@/types/Answer';
import { Paginate } from '@/types/Paginate';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import 'react-loading-skeleton/dist/skeleton.css';
import { PROTECTED_API_BASE_URL } from 'src/services/api';
import fetchUserPreviousExams from 'src/utils/FetchAnswers';
import swal from 'sweetalert';

const PreviousExamsTable: React.FC = () => {
  const router = useRouter();

  const [fetchUrl, setFetchUrl] = useState<string | null>(`${PROTECTED_API_BASE_URL}/exams`);
  const [previousExamResponse, setPreviousExamResponse] = useState<Paginate<Answer>>();

  const { theme } = useTheme();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchUserPreviousExams(fetchUrl);
        setPreviousExamResponse(data);
      } catch (error) {
        swal({
          title: 'Erro',
          text: 'Não foi possível obter o resultado de exames.',
          icon: 'error',
          className: theme === 'dark' ? 'swal-dark' : ''
        });
        router.push('/');
      }
    }

    fetchData();
  }, [fetchUrl, router, theme]);

  return (
    <section className="mt-5 w-full md:px-16 flex flex-col place-items-center px-6">
      {previousExamResponse === undefined ? (
        <ExamTableLoading />
      ) : previousExamResponse.data.length ? (
        <>
          <ExamsTable previousExamResponse={previousExamResponse} />
          <Pagination
            metadata={previousExamResponse.meta}
            fetchUrl={fetchUrl ?? `${PROTECTED_API_BASE_URL}/exams`}
            setFetchUrl={setFetchUrl}
          />
        </>
      ) : (
        <p>Ainda não realizaste nenhum exame...</p>
      )}
    </section>
  );
};

export default PreviousExamsTable;
