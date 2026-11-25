'use client';

import { useMessages } from '@/i18n/client';

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
import { apiRequest } from '@/services/apiClient';
import Score from '@/types/Score';
import { Eye, EyeOff } from 'lucide-react';
import Link from '@/i18n/navigation';
import React from 'react';
import swal from 'sweetalert';

interface UsePreviousExamsTableProps {
  userScores: Score[];
}

const UserProfileScoreboard: React.FC<UsePreviousExamsTableProps> = ({ userScores }) => {
  const t = useMessages();

  const [scores, setScores] = React.useState(userScores);

  async function handleVisibilityChange(subjectId: number, show_scoreboard: boolean) {
    swal({
      title: t('copy.are_you_sure_you_want_to_change_visibility'),
      text: t('copy.this_will_change_whether_other_users_can_see_your_score'),
      icon: 'warning',
      buttons: [t('copy.cancel'), t('copy.yes_change_it')],
      dangerMode: true
    }).then(async (willChange) => {
      if (!willChange) return;

      try {
        await apiRequest(`subjects/${subjectId}/scoreboard`, {
          authenticated: true,
          method: 'POST',
          json: { visibility: !show_scoreboard }
        });
      } catch {
        swal(t('copy.an_error_occurred_while_changing_visibility'), {
          icon: 'error',
          timer: 1500
        });
        return;
      }
      swal(t('copy.visibility_changed_successfully'), {
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
            <TableHead>{t('copy.subject_2')}</TableHead>
            <TableHead className="text-center">{t('copy.score')}</TableHead>
            <TableHead className="text-center">{t('copy.visible')}</TableHead>
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
