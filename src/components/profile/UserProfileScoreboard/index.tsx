'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import useSession from '@/hooks/useSession';
import { PROTECTED_API_BASE_URL } from '@/services/api';
import Score from '@/types/Score';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import swal from 'sweetalert';

interface UsePreviousExamsTableProps {
  userScores: Score[];
}

const UserProfileScoreboard: React.FC<UsePreviousExamsTableProps> = ({ userScores }) => {
  const { token } = useSession();
  const [scores, setScores] = React.useState(userScores);

  async function handleVisibilityChange(subjectId: number, show_scoreboard: boolean) {
    swal({
      title: 'Tens a certeza que queres alterar a visibilidade?',
      text: 'Isto irá alterar a visibilidade do teu score para os outros utilizadores.',
      icon: 'warning',
      buttons: ['Cancelar', 'Sim, alterar'],
      dangerMode: true
    }).then(async (willChange) => {
      if (!willChange) return;

      const res = await fetch(`${PROTECTED_API_BASE_URL}/subjects/${subjectId}/scoreboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ visibility: !show_scoreboard })
      });
      if (!res.ok) {
        swal('Ocorreu um erro ao alterar a visibilidade!', {
          icon: 'error',
          timer: 1500
        });
        return;
      }
      swal('A visibilidade foi alterada com sucesso!', {
        icon: 'success',
        timer: 1500
      });
      const s = scores.map((score) => {
        if (score.subject_id === subjectId) {
          score.show_scoreboard = !show_scoreboard;
        }
        return score;
      });
      setScores(s);
    });
  }

  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Disciplina</TableHead>
            <TableHead className="text-center">Pontuação</TableHead>
            <TableHead className="text-center">Visível</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scores.map((score) => (
            <TableRow key={score.subject_id}>
              <TableCell className="capitalize">
                <Link
                  href={`/stats/${score.subject_id}`}
                  className="font-medium text-foreground hover:text-primary hover:underline transition-colors"
                >
                  {score.subject}
                </Link>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant={score.score >= 50 ? 'success' : 'destructive'}
                  className="font-bold tabular-nums"
                >
                  {Math.round(score.score)}%
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8 text-muted-foreground hover:text-primary"
                  onClick={() => handleVisibilityChange(score.subject_id, score.show_scoreboard)}
                  aria-label={score.show_scoreboard ? 'Esconder' : 'Mostrar'}
                >
                  {score.show_scoreboard ? (
                    <Eye className="size-4" />
                  ) : (
                    <EyeOff className="size-4" />
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default UserProfileScoreboard;
