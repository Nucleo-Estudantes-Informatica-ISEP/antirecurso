import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

const TableHeading: React.FC = () => {
  return (
    <TableHeader>
      <TableRow className="hover:bg-transparent">
        <TableHead>Disciplina</TableHead>
        <TableHead className="text-center">Pontuação</TableHead>
        <TableHead className="text-center hidden sm:table-cell">Data</TableHead>
        <TableHead className="text-center hidden md:table-cell">Tempo</TableHead>
        <TableHead className="text-center">Modo</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default TableHeading;
