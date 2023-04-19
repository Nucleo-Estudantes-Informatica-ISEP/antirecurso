'use client';

import User from 'src/types/User';
import Pagination from '../Pagination';
import Link from 'next/link';
import { formatDateDDStrMonthYYYY } from 'src/utils/Date';
import { useEffect, useRef, useState } from 'react';

interface PreviousExamsTableProps {
  user: User;
}

export default function PreviousExamsTable({ user }: PreviousExamsTableProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const N_ITEMS_PER_PAGE = 10;

  const nPages = Math.ceil(user.answers.length / N_ITEMS_PER_PAGE);

  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * N_ITEMS_PER_PAGE;
  const endIndex = startIndex + N_ITEMS_PER_PAGE;

  useEffect(() => {
    sectionRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
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
          {user.answers.slice(startIndex, endIndex).map((answer) => (
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
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalPages={nPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </section>
  );
}
