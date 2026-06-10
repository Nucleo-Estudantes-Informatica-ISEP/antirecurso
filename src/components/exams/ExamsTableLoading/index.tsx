import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

const N_ITEMS_PER_PAGE = 8;

const ExamTableLoading = () => {
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
          {Array.from({ length: N_ITEMS_PER_PAGE }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-6 w-16 mx-auto rounded-full" />
              </TableCell>
              <TableCell className="text-center hidden sm:table-cell">
                <Skeleton className="h-4 w-24 mx-auto" />
              </TableCell>
              <TableCell className="text-center hidden md:table-cell">
                <Skeleton className="h-4 w-12 mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-6 w-20 mx-auto rounded-full" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExamTableLoading;
