'use client';

import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import 'react-loading-skeleton/dist/skeleton.css';
import { BASE_URL } from 'src/services/api';
import PreviousExamResponse from 'src/types/PreviousExamResponse';
import fetchUserPreviousExams from 'src/utils/FetchAnswers';
import swal from 'sweetalert';
import Pagination from '../../utils/Pagination';
import ExamsTable from '../ExamsTable';
import ExamTableLoading from '../ExamsTableLoading';

interface PreviousExamsTableProps {
  token: string;
}

const PreviousExamsTable: React.FC<PreviousExamsTableProps> = ({ token }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const router = useRouter();

  const [fetchUrl, setFetchUrl] = useState<string | null>(BASE_URL + '/exams');
  const [previousExamResponse, setPreviousExamResponse] = useState<PreviousExamResponse>();

  const { theme } = useTheme();

  useEffect(() => {
    sectionRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [fetchUrl]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchUserPreviousExams(fetchUrl, token);
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
  }, [fetchUrl, router, theme, token]);

  return (
    <section className="mt-5 w-full md:px-16 flex flex-col place-items-center px-6">
      {previousExamResponse === undefined ? (
        <ExamTableLoading />
      ) : previousExamResponse.data.length ? (
        <>
          <ExamsTable previousExamResponse={previousExamResponse} />
          <Pagination metadata={previousExamResponse?.meta} setFetchUrl={setFetchUrl} />
        </>
      ) : (
        <p>Ainda não realizaste nenhum exame...</p>
      )}
    </section>
  );
};

export default PreviousExamsTable;
