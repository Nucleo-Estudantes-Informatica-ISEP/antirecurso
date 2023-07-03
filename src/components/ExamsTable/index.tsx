import React from 'react';

import Link from 'next/link';
import PreviousExamResponse from 'src/types/PreviousExamResponse';
import { formatDateDDStrMonthYYYY } from 'src/utils/Date';
import TableHeading from '../TableHeading';

interface ExamsTableProps {
  previousExamResponse: PreviousExamResponse;
}

const ExamsTable: React.FC<ExamsTableProps> = ({ previousExamResponse }) => {
  return (
    <table className="w-1/2 text-sm text-center">
      <TableHeading />
      <tbody>
        {previousExamResponse.data.map((answer) => (
          <tr key={answer.id} className="bg-white border-b dark:bg-primary-dark">
            <td className="w-1/4 px-2 py-2 text-xs sm:px-6 sm:py-4">
              <Link
                href={`/exams/${answer.id}/review/`}
                className="text-xs underline capitalize transition ease-in-out hover:text-primary md:text-base">
                {answer.subject}
              </Link>
            </td>
            <td className="w-1/4 px-2 py-2 text-xs md:text-base sm:px-6 sm:py-4">{answer.score}</td>
            <td className="w-1/4 px-2 py-2 text-xs md:text-base sm:px-6 sm:py-4">
              {formatDateDDStrMonthYYYY(answer.created_at)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ExamsTable;
