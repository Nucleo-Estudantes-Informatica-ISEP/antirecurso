'use client';

import { useLanguage, useMessages } from '@/i18n/client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useRouter } from '@/i18n/navigation';
import swal from 'sweetalert';
import { Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { PROTECTED_API_BASE_URL } from '@/services/api';
import { apiRequest } from '@/services/apiClient';
import fetchUserPendingExams from '@/utils/FetchPendingExams';
import {
  getLocalExamStateKey,
  getResumeSearchParams,
  parseSavedExamState
} from '@/services/examState';
import PendingExam from '@/types/PendingExam';

const PendingExamsTable: React.FC = () => {
  const t = useMessages();
  const lang = useLanguage();

  const router = useRouter();
  const fetchUrl = `${PROTECTED_API_BASE_URL}/exams/pending`;
  const [pendingExamResponse, setPendingExamResponse] = useState<PendingExam[] | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchUserPendingExams(fetchUrl);
        setPendingExamResponse(data?.data ?? []);
      } catch {
        swal({
          title: t('copy.error_2'),
          text: t('copy.could_not_retrieve_unfinished_exams'),
          icon: 'error',
          className: theme === 'dark' ? 'swal-dark' : ''
        });
        router.push('/');
      }
    }

    fetchData();
  }, [fetchUrl, router, theme, t]);

  if (pendingExamResponse === null) {
    return (
      <section className="w-full flex flex-col items-center px-2 md:px-6 mt-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-10 w-full max-w-4xl rounded border bg-muted animate-pulse mb-2"
          />
        ))}
      </section>
    );
  }

  if (!pendingExamResponse.length) {
    return <p className="text-muted-foreground py-8">{t('copy.you_have_no_unfinished_exams')}</p>;
  }

  return (
    <section className="w-full flex flex-col items-center px-2 md:px-6 mt-2">
      <div className="w-full max-w-4xl rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>{t('copy.subject_2')}</TableHead>
              <TableHead className="text-center">{t('copy.mode_2')}</TableHead>
              <TableHead className="text-center hidden sm:table-cell">
                {t('copy.progress_2')}
              </TableHead>
              <TableHead className="text-center hidden md:table-cell">
                {t('copy.last_updated')}
              </TableHead>
              <TableHead className="text-center">{t('copy.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingExamResponse.map((exam) => {
              const state = parseSavedExamState(exam.state, exam.subject_id, exam.mode);
              const total = state?.questionIds.length ?? 0;
              const answered = state?.answers.length ?? 0;
              const progress = total > 0 ? Math.round((answered / total) * 100) : 0;

              const handleDelete = async () => {
                const confirmed = await swal({
                  title: t('copy.delete_unfinished_exam'),
                  text: t('copy.are_you_sure_this_action_cannot_be_undone'),
                  icon: 'warning',
                  buttons: [t('copy.cancel'), 'Eliminar'],
                  className: theme === 'dark' ? 'swal-dark' : ''
                });

                if (!confirmed) return;

                try {
                  await apiRequest(
                    `exams/state?subject_id=${exam.subject_id}&mode=${encodeURIComponent(exam.mode)}`,
                    { authenticated: true, method: 'DELETE' }
                  );
                  localStorage.removeItem(getLocalExamStateKey(exam.subject_id, exam.mode));
                  const data = await fetchUserPendingExams(fetchUrl);
                  setPendingExamResponse(data?.data ?? []);
                } catch {
                  swal({
                    title: t('copy.error_2'),
                    text: t('copy.could_not_delete_the_unfinished_exam'),
                    icon: 'error',
                    className: theme === 'dark' ? 'swal-dark' : ''
                  });
                }
              };

              return (
                <TableRow key={exam.id}>
                  <TableCell className="capitalize">
                    <button
                      type="button"
                      onClick={() => {
                        if (!state) return;
                        router.push(
                          `/exams/${exam.subject_id}/answer/${exam.mode}?${getResumeSearchParams(state)}`
                        );
                      }}
                      disabled={!state}
                      className="font-medium text-foreground hover:text-primary transition-colors hover:underline"
                    >
                      {exam.subject}
                    </button>
                  </TableCell>
                  <TableCell className="text-center capitalize">
                    <Badge variant="outline">{exam.mode}</Badge>
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground hidden sm:table-cell">
                    {total > 0 ? `${progress}%` : '—'}
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground tabular-nums hidden md:table-cell">
                    {new Date(exam.updated_at).toLocaleDateString(
                      lang === 'pt' ? 'pt-PT' : 'en-GB'
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      aria-label={t('copy.delete_unfinished_exam')}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default PendingExamsTable;
