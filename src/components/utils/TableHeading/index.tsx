'use client';

import { useMessages } from '@/i18n/client';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

const TableHeading: React.FC = () => {
  const t = useMessages();

  return (
    <TableHeader>
      <TableRow className="hover:bg-transparent">
        <TableHead>{t('copy.subject_2')}</TableHead>
        <TableHead className="text-center">{t('copy.score')}</TableHead>
        <TableHead className="text-center hidden sm:table-cell">{t('copy.date')}</TableHead>
        <TableHead className="text-center hidden md:table-cell">{t('copy.time')}</TableHead>
        <TableHead className="text-center">{t('copy.mode_2')}</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default TableHeading;
