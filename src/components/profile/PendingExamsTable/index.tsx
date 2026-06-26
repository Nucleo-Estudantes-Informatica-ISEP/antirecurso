'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import swal from 'sweetalert';
import { Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PROTECTED_API_BASE_URL } from '@/services/api';
import fetchUserPendingExams from '@/utils/FetchPendingExams';

interface PendingExam {
  id: number;
  subject: string;
  subject_id: number;
  mode: string;
  data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

const PendingExamsTable: React.FC = () => {
  const router = useRouter();
  const [fetchUrl, setFetchUrl] = useState<string | null>(`${PROTECTED_API_BASE_URL}/exams/pending`);
  const [pendingExamResponse, setPendingExamResponse] = useState<PendingExam[] | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchUserPendingExams(fetchUrl);
        setPendingExamResponse(data?.data ?? []);
      } catch {
        swal({
          title: 'Erro',
          text: 'Não foi possível obter os exames por terminar.',
          icon: 'error',
          className: theme === 'dark' ? 'swal-dark' : '',
        });
        router.push('/');
      }
    }

    fetchData();
  }, [fetchUrl, router, theme]);

  if (pendingExamResponse === null) {
    return (
      <section className="w-full flex flex-col items-center px-2 md:px-6 mt-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-10 w-full max-w-4xl rounded border bg-muted animate-pulse mb-2" />
        ))}
      </section>
    );
  }

  if (!pendingExamResponse.length) {
    return <p className="text-muted-foreground py-8">Não tens exames por terminar.</p>;
  }

  return (
    <section className="w-full flex flex-col items-center px-2 md:px-6 mt-2">
      <div className="w-full max-w-4xl rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Disciplina</TableHead>
              <TableHead className="text-center">Modo</TableHead>
              <TableHead className="text-center hidden sm:table-cell">Progresso</TableHead>
              <TableHead className="text-center hidden md:table-cell">Última atualização</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingExamResponse.map((exam) => {
              const total = (exam.data as { totalQuestions?: number })?.totalQuestions ?? 0;
              const answered = (exam.data as { answered?: number })?.answered ?? 0;
              const progress = total > 0 ? Math.round((answered / total) * 100) : 0;

              const handleDelete = async () => {
                const confirmed = await swal({
                  title: 'Eliminar exame pendente',
                  text: 'Tens a certeza? Esta ação não pode ser desfeita.',
                  icon: 'warning',
                  buttons: ['Cancelar', 'Eliminar'],
                  className: theme === 'dark' ? 'swal-dark' : '',
                });

                if (!confirmed) return;

                try {
                  const res = await fetch(
                    `${PROTECTED_API_BASE_URL}/exams/state?subject_id=${exam.subject_id}&mode=${encodeURIComponent(exam.mode)}`,
                    { method: 'DELETE' }
                  );

                  if (res.ok) {
                    localStorage.removeItem(`exam-state-${exam.subject_id}`);
                    const data = await fetchUserPendingExams(fetchUrl);
                    setPendingExamResponse(data?.data ?? []);
                  } else {
                    throw new Error('Failed');
                  }
                } catch {
                  swal({
                    title: 'Erro',
                    text: 'Não foi possível eliminar o exame pendente.',
                    icon: 'error',
                    className: theme === 'dark' ? 'swal-dark' : '',
                  });
                }
              };

              return (
                <TableRow key={exam.id}>
                  <TableCell className="capitalize">
                    <button
                      type="button"
                      onClick={() => router.push(`/exams/${exam.subject_id}/answer/${exam.mode}?resume=true`)}
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
                    {new Date(exam.updated_at).toLocaleDateString('pt-PT')}
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      aria-label="Eliminar exame pendente"
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
