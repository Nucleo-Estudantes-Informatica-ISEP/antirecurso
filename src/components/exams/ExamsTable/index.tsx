import React from 'react';

import TableHeading from '@/components/utils/TableHeading';
import { sanitizeMode } from '@/utils/sanitizeMode';
import Link from 'next/link';
import PreviousExamResponse from 'src/types/PreviousExamResponse';
import { formatDateDDStrMonthYYYY } from 'src/utils/Date';

interface ExamsTableProps {
  previousExamResponse: PreviousExamResponse;
}

const ExamsTable: React.FC<ExamsTableProps> = ({ previousExamResponse }) => {
  return (
    <table className="w-5/6 lg:w-1/2 text-sm text-center overflow-x-scroll">
      <TableHeading />
      <tbody>
        {previousExamResponse.data.map((answer) => (
          <tr key={answer.id} className="bg-white border-b dark:bg-primary-dark">
            <td className="w-1/6 py-2 text-xs md:px-6 sm:py-4">
              <Link
                href={`/exams/${answer.id}/review/`}
                className="text-xs underline capitalize transition ease-in-out hover:text-primary md:text-base">
                {answer.subject}
              </Link>
            </td>
            <td className="w-1/6 py-2 text-xs md:text-base md:px-6 sm:py-4">{answer.score}</td>
            <td className="w-1/6 py-2 text-xs md:text-base md:px-6 sm:py-4">
              {formatDateDDStrMonthYYYY(answer.created_at)}
            </td>
            <td className="w-1/6 py-2 text-xs md:text-base md:px-6 sm:py-4 capitalize">
              {answer.time
                ? `${Math.floor(answer.time / 60)}:${answer.time % 60 < 10 ? '0' : ''}${
                    answer.time % 60
                  }`
                : '--'}
            </td>
            <td className="w-1/6 py-2 text-xs md:text-base md:px-6 sm:py-4 capitalize">
              {sanitizeMode(answer.mode)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ExamsTable;
