import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import Answer from '@/types/Answer';
import { Paginate } from '@/types/Paginate';
import { sanitizeMode } from '@/utils/sanitizeMode';
import Link from 'next/link';
import React from 'react';
import { formatDateDDStrMonthYYYY } from 'src/utils/Date';

interface ExamsTableProps {
  previousExamResponse: Paginate<Answer>;
}

const ExamsTable: React.FC<ExamsTableProps> = ({ previousExamResponse }) => {
  return (
    <div className="w-full max-w-4xl rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Disciplina</TableHead>
            <TableHead className="text-center">Pontuação</TableHead>
            <TableHead className="text-center hidden sm:table-cell">Data</TableHead>
            <TableHead className="text-center hidden md:table-cell">Tempo</TableHead>
            <TableHead className="text-center">Modo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {previousExamResponse.data.map((answer) => (
            <TableRow key={answer.id}>
              <TableCell className="capitalize">
                <Link
                  href={`/exams/${answer.id}/review/`}
                  className="font-medium text-foreground hover:text-primary transition-colors hover:underline"
                >
                  {answer.subject}
                </Link>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant={answer.score >= 50 ? 'success' : 'destructive'}
                  className="font-bold"
                >
                  {Math.round(answer.score)}%
                </Badge>
              </TableCell>
              <TableCell className="text-center text-muted-foreground hidden sm:table-cell">
                {formatDateDDStrMonthYYYY(answer.created_at)}
              </TableCell>
              <TableCell className="text-center text-muted-foreground tabular-nums hidden md:table-cell">
                {answer.time
                  ? `${Math.floor(answer.time / 60)}:${answer.time % 60 < 10 ? '0' : ''}${
                      answer.time % 60
                    }`
                  : '--'}
              </TableCell>
              <TableCell className="text-center capitalize">
                <Badge variant="outline">{sanitizeMode(answer.mode)}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExamsTable;
