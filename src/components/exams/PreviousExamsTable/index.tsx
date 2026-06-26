'use client';

import Answer from '@/types/Answer';
import { Paginate } from '@/types/Paginate';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PROTECTED_API_BASE_URL } from 'src/services/api';
import fetchUserPreviousExams from 'src/utils/FetchAnswers';
import swal from 'sweetalert';
import Pagination from '../../utils/Pagination';
import ExamsTable from '../ExamsTable';
import ExamTableLoading from '../ExamsTableLoading';

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
      } catch {
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
    <section className="w-full flex flex-col items-center px-2 md:px-6 mt-2">
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
        <p className="text-muted-foreground py-8">Ainda não realizaste nenhum exame.</p>
      )}
    </section>
  );
};

export default PreviousExamsTable;
