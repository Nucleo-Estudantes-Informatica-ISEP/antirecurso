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
          <tr key={answer.id} className="bg-white border-b">
            <td className="text-xs px-2 sm:px-6 py-2 sm:py-4 w-1/4">
              <Link
                href={`/exams/${answer.id}/review/`}
                className="hover:text-primary text-xs md:text-base transition ease-in-out capitalize">
                {answer.subject}
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
