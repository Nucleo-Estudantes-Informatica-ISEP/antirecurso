'use client';

import User from 'src/types/User';
import Pagination from '../Pagination';
import Link from 'next/link';
import { formatDateDDStrMonthYYYY } from 'src/utils/Date';
import { useEffect, useRef, useState } from 'react';
import Answer from 'src/types/Answer';
import fetchAnswers from 'src/utils/FetchAnswers';
import swal from 'sweetalert';

interface PreviousExamsTableProps {
  user: User;
  token: string;
}

const PreviousExamsTable: React.FC<PreviousExamsTableProps> = ({ user, token }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const N_ITEMS_PER_PAGE = 10;

  const nPages = Math.ceil(user.answers.length / N_ITEMS_PER_PAGE);

  const [currentPage, setCurrentPage] = useState(1);
  const [answerPerPage, setAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    sectionRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [currentPage]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchAnswers({ token, currentPage });
        setAnswers(data.answers);
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
  }, [currentPage]);

  return (
    <section ref={sectionRef} className="my-5 md:px-16 w-full grid place-items-center">
      <table className="w-1/2 text-sm text-center">
        <thead className="text-xs text-white uppercase bg-primary">
          <tr>
            <th scope="col" className="px-6 py-3">
              Disciplina
            </th>
            <th scope="col" className="px-6 py-3">
              Pontuação para ranking
            </th>
            <th scope="col" className="px-6 py-3">
              Data
            </th>
          </tr>
        </thead>
        <tbody>
          {answerPerPage.map((answer) => {
            return (
              <tr className="bg-white border-b">
                <td className="px-6 py-4">
                  <Link
                    href={`/exams/${answer.id}/review/`}
                    className="hover:text-primary transition ease-in-out">
                    {answer.subject.toUpperCase()}
                  </Link>
                </td>
                <td className="px-6 py-4">{answer.score}</td>
                <td className="px-6 py-4">{formatDateDDStrMonthYYYY(answer.created_at)}</td>{' '}
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalPages={nPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </section>
  );
};

export default PreviousExamsTable;
