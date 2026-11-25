'use client';

import { useLanguage, useMessages } from '@/i18n/client';
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
import Link from '@/i18n/navigation';
import React from 'react';
import { formatDateDDStrMonthYYYY } from 'src/utils/Date';

interface ExamsTableProps {
  previousExamResponse: Paginate<Answer>;
}

const ExamsTable: React.FC<ExamsTableProps> = ({ previousExamResponse }) => {
  const t = useMessages();
  const lang = useLanguage();

  return (
    <div className="w-full max-w-4xl rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>{t('copy.subject_2')}</TableHead>
            <TableHead className="text-center">{t('copy.score')}</TableHead>
            <TableHead className="text-center hidden sm:table-cell">{t('copy.date')}</TableHead>
            <TableHead className="text-center hidden md:table-cell">{t('copy.time')}</TableHead>
            <TableHead className="text-center">{t('copy.mode_2')}</TableHead>
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
                <Badge variant="outline">{sanitizeMode(answer.mode, lang)}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExamsTable;
