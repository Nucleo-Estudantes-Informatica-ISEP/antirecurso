'use client';

import LineChart from '@/components/charts/LineChart';
import PieChart from '@/components/charts/PieChart';
import GradeCalculatorContainer from '@/components/profile/GradeCalculatorContainer';
import ScoreIndicator from '@/components/profile/ScoreIndicator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import useSession from '@/hooks/useSession';
import { sanitizeMode } from '@/utils/sanitizeMode';
import { fetcher } from '@/utils/SWRFetcher';
import { Info, LineChart as LineChartIcon, Sparkles, Trophy } from 'lucide-react';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { BASE_URL } from 'src/services/api';
import type { SubjectStats } from 'src/types/SubjectStats';
import getSubjectNameById from 'src/utils/getSubjectNameById';
import { getSubjectStatsViewModel } from '@/services/subjectStats';
import useSWR from 'swr';

interface SubjectStatsProps {
  params: Promise<{
    id: string;
  }>;
}

const SubjectStatsPage: React.FC<SubjectStatsProps> = ({ params }) => {
  const resolvedParams = use(params);
  const [subjectName, setSubjectName] = useState('');
  const { token } = useSession();
  const subjectId = Number.parseInt(resolvedParams.id, 10);
  const url = `${BASE_URL}/subjects/${resolvedParams.id}/stats`;

  const { data: subjectStats } = useSWR<SubjectStats>(
    token ? [url, token as string] : null,
    ([url, token]) => fetcher(url, token as string),
    { revalidateOnFocus: false, keepPreviousData: true }
  );
  const statsView = subjectStats ? getSubjectStatsViewModel(subjectStats) : null;

  useEffect(() => {
    async function fetchSubjectName() {
      const sName = await getSubjectNameById(subjectId);
      setSubjectName(sName);
    }
    fetchSubjectName();
  }, [subjectId, token]);

  return (
    <section className="container py-8 md:py-12 w-full max-w-7xl">
      <div className="flex flex-col items-center text-center mb-8">
        <Badge variant="soft" className="mb-3">
          Estatísticas
        </Badge>
        <h1 className="text-balance text-3xl md:text-4xl font-bold tracking-tight">
          As tuas estatísticas de <span className="gradient-text">{subjectName || '...'}</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5">
        {/* Info card */}
        <Card className="lg:col-span-7">
          <CardContent className="p-5 md:p-6 flex items-start gap-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
              <Info className="size-5" />
            </div>
            {subjectStats ? (
              <p className="text-sm md:text-base leading-relaxed">
                Já respondeste a{' '}
                <span className="font-bold text-primary">{subjectStats.n_of_exams_taken}</span>{' '}
                exames. Das{' '}
                <span className="font-bold text-primary">{subjectStats.total_of_questions}</span>{' '}
                questões disponíveis respondeste a{' '}
                <span className="font-bold text-primary">{statsView?.questionsSeen}</span>, ou seja{' '}
                <span className="font-bold text-primary">
                  {statsView?.questionsSeenPercentage}%
                </span>
                . Demoras, em média,{' '}
                <span className="font-bold text-primary">{statsView?.meanTimeLabel}</span> a
                responder a um exame.
              </p>
            ) : (
              <Skeleton className="h-16 w-full" />
            )}
          </CardContent>
        </Card>

        {/* Score Indicator */}
        <Card className="lg:col-span-3">
          <CardContent className="p-5 md:p-6 flex flex-col items-center justify-center">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">
              Média global
            </p>
            {subjectStats ? (
              <ScoreIndicator score={statsView?.averageGrade ?? 0} />
            ) : (
              <Skeleton className="h-32 w-48 mt-2 rounded-t-full" />
            )}
          </CardContent>
        </Card>

        {/* Ranking */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-primary/10 via-transparent to-transparent">
          <CardContent className="p-5 md:p-6 flex flex-col items-center justify-center h-full text-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Trophy className="size-5" />
            </div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              Ranking
            </p>
            {subjectStats ? (
              subjectStats.place_in_scoreboard === null ? (
                <span className="text-sm text-muted-foreground">Sem posição</span>
              ) : (
                <span className="text-3xl md:text-4xl font-black text-primary">
                  #{subjectStats.place_in_scoreboard}
                </span>
              )
            ) : (
              <Skeleton className="h-10 w-16" />
            )}
          </CardContent>
        </Card>

        {/* Suggestion */}
        <Card className="lg:col-span-12">
          <CardContent className="p-5 md:p-6 flex items-start gap-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
              <Sparkles className="size-5" />
            </div>
            {subjectStats ? (
              <p className="text-sm md:text-base leading-relaxed">
                Com base nos exames que respondeste, sugerimos-te que resolvas um exame do{' '}
                <Link
                  href={`/exams/${resolvedParams.id}/answer/${subjectStats.suggested_mode}`}
                  className="font-bold text-primary hover:underline"
                >
                  modo {sanitizeMode(subjectStats.suggested_mode)}
                </Link>{' '}
                para continuares a melhorar.
              </p>
            ) : (
              <Skeleton className="h-6 w-full" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pie charts */}
      <div className="mt-5 md:mt-6">
        {subjectStats ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            <Card>
              <CardContent className="p-5 flex flex-col items-center gap-3">
                <Badge variant="soft" className="self-stretch justify-center py-1.5">
                  Número de exames
                </Badge>
                <PieChart
                  labels={['Aprovado', 'Reprovado']}
                  text="Nº de exames"
                  backgroundColor={['rgba(34, 197, 94, 0.75)', 'rgba(239, 68, 68, 0.75)']}
                  borderColor={['rgba(34, 197, 94, 1)', 'rgba(239, 68, 68, 1)']}
                  data={[
                    subjectStats.n_of_exams_passed,
                    subjectStats.n_of_exams_taken - subjectStats.n_of_exams_passed
                  ]}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 flex flex-col items-center gap-3">
                <Badge variant="soft" className="self-stretch justify-center py-1.5">
                  Número de questões
                </Badge>
                <PieChart
                  labels={['Corretas', 'Incorretas', 'Não respondidas']}
                  text="Nº de questões"
                  backgroundColor={[
                    'rgba(34, 197, 94, 0.75)',
                    'rgba(239, 68, 68, 0.75)',
                    'rgba(148, 163, 184, 0.5)'
                  ]}
                  borderColor={[
                    'rgba(34, 197, 94, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(148, 163, 184, 1)'
                  ]}
                  data={statsView?.questionBreakdown ?? [0, 0, 0]}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 flex flex-col items-center gap-3">
                <Badge variant="soft" className="self-stretch justify-center py-1.5">
                  Tipo de exame
                </Badge>
                <PieChart
                  labels={Object.keys(subjectStats.mode_scores).map(
                    (mode) =>
                      sanitizeMode(mode).charAt(0).toUpperCase() + sanitizeMode(mode).slice(1)
                  )}
                  backgroundColor={[
                    'rgba(211, 93, 25, 0.75)',
                    'rgba(34, 197, 94, 0.75)',
                    'rgba(168, 85, 247, 0.75)',
                    'rgba(59, 130, 246, 0.75)',
                    'rgba(234, 179, 8, 0.75)',
                    'rgba(20, 184, 166, 0.75)'
                  ]}
                  borderColor={[
                    'rgba(211, 93, 25, 1)',
                    'rgba(34, 197, 94, 1)',
                    'rgba(168, 85, 247, 1)',
                    'rgba(59, 130, 246, 1)',
                    'rgba(234, 179, 8, 1)',
                    'rgba(20, 184, 166, 1)'
                  ]}
                  text="Nº de exames"
                  data={Object.values(subjectStats.mode_scores)}
                />
              </CardContent>
            </Card>
          </div>
        ) : (
          <Skeleton className="h-72 w-full" />
        )}
      </div>

      {/* Line chart */}
      <Card className="mt-5 md:mt-6">
        <CardContent className="p-5 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <LineChartIcon className="size-5 text-primary" />
            <h3 className="font-semibold">Evolução das tuas notas</h3>
          </div>
          {subjectStats ? (
            <div className="relative min-h-[300px] md:min-h-[400px]">
              <LineChart
                labels={subjectStats.user_scores.map((score) =>
                  new Date(score.created_at).toLocaleDateString('pt-PT')
                )}
                text="Nota do exame"
                data={subjectStats.user_scores.map((score) => (score.score * 20) / 100)}
              />
            </div>
          ) : (
            <Skeleton className="h-72 w-full" />
          )}
        </CardContent>
      </Card>

      {/* Grade calc */}
      {subjectStats && (
        <div className="mt-5 md:mt-6">
          <GradeCalculatorContainer subjectStats={subjectStats} />
        </div>
      )}
    </section>
  );
};

export default SubjectStatsPage;
