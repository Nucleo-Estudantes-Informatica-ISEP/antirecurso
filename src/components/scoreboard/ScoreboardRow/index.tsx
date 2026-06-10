'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Score from 'src/types/Score';

interface ScoreboardRowProps {
  line: Score;
  position: number;
  highlight?: boolean;
}

const ScoreboardRow: React.FC<ScoreboardRowProps> = ({ line, position, highlight }) => {
  const userInitials = line.user_name
    ? line.user_name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '';

  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className={cn(
        'border-b transition-colors hover:bg-muted/40',
        highlight && 'bg-primary/10 hover:bg-primary/15'
      )}
    >
      <TableCell className="w-16 text-center font-bold text-muted-foreground tabular-nums">
        {position}
      </TableCell>
      <TableCell className="w-14">
        <Avatar className="size-10">
          <AvatarImage
            src={`https://gravatar.com/avatar/${line.avatar}?s=64&d=identicon`}
            alt={line.user_name}
          />
          <AvatarFallback>{userInitials}</AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">
            {line.user_name}
            {highlight && (
              <Badge variant="soft" className="ml-2 align-middle">
                Tu
              </Badge>
            )}
          </span>
          <span className="text-xs text-muted-foreground">
            {line.exams} {line.exams === 1 ? 'exame' : 'exames'}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-right pr-6 font-bold text-primary text-base md:text-lg tabular-nums">
        {line.score}
      </TableCell>
    </motion.tr>
  );
};

export default ScoreboardRow;
