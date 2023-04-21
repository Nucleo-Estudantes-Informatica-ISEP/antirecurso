'use client';

import Pagination from '../Pagination';
import { useEffect, useRef, useState } from 'react';
import fetchUserPreviousExams from 'src/utils/FetchAnswers';
import swal from 'sweetalert';
import 'react-loading-skeleton/dist/skeleton.css';
import PreviousExamResponse from 'src/types/PreviousExamResponse';
import { BASE_URL } from 'src/services/api';
import ExamTableLoading from '../ExamsTableLoading';
import ExamsTable from '../ExamsTable';

interface PreviousExamsTableProps {
  token: string;
}

const N_ITEMS_PER_PAGE = 10;

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
  }, [fetchUrl]);

  return (
    <section ref={sectionRef} className="my-5 md:px-16 w-full grid place-items-center">
      {previousExamResponse === undefined ? (
        <>
          <ExamTableLoading />
        </>
      ) : (
        <>
          <ExamsTable previousExamResponse={previousExamResponse} />
          <Pagination metadata={previousExamResponse?.meta} setFetchUrl={setFetchUrl} />
        </>
      )}
    </section>
  );
};

export default PreviousExamsTable;
