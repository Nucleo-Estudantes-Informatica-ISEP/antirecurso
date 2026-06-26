'use client';

import ScoreboardPodium from '@/components/scoreboard/ScoreboardPodium';
import ScoreboardRow from '@/components/scoreboard/ScoreboardRow';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useSession from '@/hooks/useSession';
import { BASE_URL } from '@/services/api';
import Leaderboard from '@/types/Leaderboard';
import getSubjectNameById from '@/utils/getSubjectNameById';
import { fetcher } from '@/utils/SWRFetcher';
import { sanitizeMode } from '@/utils/sanitizeMode';
import { motion } from 'framer-motion';
import { Info, Trophy } from 'lucide-react';
import { use, useEffect, useState } from 'react';
import useSWR from 'swr';

interface ScoreboardPageProps {
  params: Promise<{
    id: string;
  }>;
}

const examModes = ['custom', 'default', 'realistic', 'all', 'new', 'wrong', 'hard'];

const ScoreboardPage: React.FC<ScoreboardPageProps> = ({ params }) => {
  const resolvedParams = use(params);
  const [mode, setMode] = useState<string>('all');
  const [subjectName, setSubjectName] = useState<string | null>(null);
  const { user } = useSession();

  const { data: scoreboard } = useSWR<Leaderboard>(
    `${BASE_URL}/subjects/${resolvedParams.id}/scoreboard/${mode}`,
    (url) => fetcher(url, null),
    { revalidateOnFocus: false, keepPreviousData: true }
  );

  useEffect(() => {
    async function fetchSubjectNameById(id: number) {
      const s = await getSubjectNameById(id);
      setSubjectName(s);
    }
    fetchSubjectNameById(Number.parseInt(resolvedParams.id, 10));
  }, [resolvedParams.id]);

  return (
    <section className="container py-10 md:py-14 w-full">
      <div className="flex flex-col items-center text-center mb-8">
        <Badge variant="soft" className="mb-3 gap-1.5">
          <Trophy className="size-3.5" />
          Scoreboard
        </Badge>
        <h1 className="text-balance text-3xl md:text-4xl font-bold tracking-tight">
          Scoreboard de{' '}
          {subjectName ? (
            <span className="gradient-text capitalize">{subjectName}</span>
          ) : (
            <Skeleton className="inline-block h-8 w-40 align-middle" />
          )}
        </h1>
      </div>

      <div className="flex justify-center mb-8 overflow-x-auto">
        <Tabs value={mode} onValueChange={setMode}>
          <TabsList className="h-auto p-1 flex-wrap">
            {examModes.map((m) => (
              <TabsTrigger key={m} value={m} className="capitalize">
                {sanitizeMode(m)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {scoreboard !== undefined ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          {scoreboard.scores.length === 0 ? (
            <Card className="max-w-xl mx-auto">
              <CardContent className="p-10 text-center text-muted-foreground">
                Sem nenhum utilizador registado neste modo.
              </CardContent>
            </Card>
          ) : (
            <>
              <ScoreboardPodium scores={scoreboard.scores} uid={!user ? undefined : user.id} />

              {scoreboard.scores.length > 3 && (
                <Card className="max-w-3xl mx-auto mt-8 overflow-hidden">
                  <Table>
                    <TableBody>
                      {scoreboard.scores.slice(3).map((line, key) => (
                        <ScoreboardRow
                          line={line}
                          position={key + 4}
                          key={key}
                          highlight={!!user && user.id === line.user_id}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              )}
            </>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-3 max-w-3xl mx-auto gap-4 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      )}

      <div className="mt-10 max-w-3xl mx-auto space-y-3">
        <div className="flex items-center justify-center gap-3">
          <Badge variant="outline" className="text-base font-bold gap-1.5">
            <Trophy className="size-4 text-primary" />
            {scoreboard?.total ?? 0}
          </Badge>
          <span className="text-sm text-muted-foreground">exames realizados</span>
        </div>
        <Card className="bg-muted/40 border-dashed">
          <CardContent className="p-4 flex items-start gap-3 text-sm">
            <Info className="size-4 mt-0.5 text-primary shrink-0" />
            <p className="text-muted-foreground">
              Para apareceres no scoreboard precisas de ter respondido a, no mínimo,{' '}
              <span className="font-semibold text-foreground">{scoreboard?.min_answers}</span>{' '}
              exames e estar entre as{' '}
              <span className="font-semibold text-foreground">{scoreboard?.limit}</span> melhores
              médias.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ScoreboardPage;
