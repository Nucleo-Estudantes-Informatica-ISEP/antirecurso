'use client';

import { useEffect, useRef, useState } from 'react';
import 'react-loading-skeleton/dist/skeleton.css';
import { BASE_URL } from 'src/services/api';
import PreviousExamResponse from 'src/types/PreviousExamResponse';
import fetchUserPreviousExams from 'src/utils/FetchAnswers';
import swal from 'sweetalert';
import ExamsTable from '../ExamsTable';
import ExamTableLoading from '../ExamsTableLoading';
import Pagination from '../Pagination';

interface PreviousExamsTableProps {
  token: string;
}

const PreviousExamsTable: React.FC<PreviousExamsTableProps> = ({ token }) => {
  const sectionRef = useRef<HTMLElement>(null);

  const [fetchUrl, setFetchUrl] = useState<string | null>(BASE_URL + '/exams');
  const [previousExamResponse, setPreviousExamResponse] = useState<PreviousExamResponse>();

  useEffect(() => {
    sectionRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [fetchUrl]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchUserPreviousExams({ token, fetchUrl });
        setPreviousExamResponse(data);
      } catch (error) {
        swal({
          title: 'Erro',
          text: 'Não foi possível obter o resultado de exames.',
          icon: 'error'
        });
        return <></>;
      }
    }

    fetchData();
  }, [fetchUrl, token]);

  return (
    <section ref={sectionRef} className="my-5 px-4 md:px-8 lg:px-16 w-full grid place-items-center">
      {previousExamResponse === undefined ? (
        <ExamTableLoading />
      ) : previousExamResponse.data.length ? (
        <>
          <ExamsTable previousExamResponse={previousExamResponse} />
          <Pagination metadata={previousExamResponse?.meta} setFetchUrl={setFetchUrl} />
        </>
      ) : (
        <p>Não realizaste nenhum exame.</p>
      )}
    </section>
  );
};

export default PreviousExamsTable;
