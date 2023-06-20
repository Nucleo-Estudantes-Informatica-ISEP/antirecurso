import React from 'react';

import TableHeading from '../TableHeading';
import { formatDateDDStrMonthYYYY } from 'src/utils/Date';
import Link from 'next/link';
import PreviousExamResponse from 'src/types/PreviousExamResponse';

interface ExamsTableProps {
  previousExamResponse: PreviousExamResponse;
}

const ExamsTable: React.FC<ExamsTableProps> = ({ previousExamResponse }) => {
  return (
    <table className="w-full sm:w-1/2 text-sm text-center">
      <TableHeading />
      <tbody>
        {previousExamResponse.data.map((answer) => (
          <tr key={answer.id} className="bg-white border-b">
            <td className="px-2 sm:px-6 py-2 sm:py-4 w-1/4">
              <Link
                href={`/exams/${answer.id}/review/`}
                className="hover:text-primary text-base transition ease-in-out">
                {answer.subject.toUpperCase()}
              </Link>
            </td>
            <td className="text-xs md:text-base px-2 sm:px-6 py-2 sm:py-4 w-1/4">{answer.score}</td>
            <td className="text-xs md:text-base px-2 sm:px-6 py-2 sm:py-4 w-1/4">
              {formatDateDDStrMonthYYYY(answer.created_at)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ExamsTable;
