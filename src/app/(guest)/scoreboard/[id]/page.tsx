'use client';

import ScoreboardPodium from '@/components/scoreboard/ScoreboardPodium';
import ScoreboardRow from '@/components/scoreboard/ScoreboardRow';
import useSession from '@/hooks/useSession';
import { BASE_URL } from '@/services/api';
import Leaderboard from '@/types/Leaderboard';
import getSubjectNameById from '@/utils/getSubjectNameById';
import { sanitizeMode } from '@/utils/sanitizeMode';
import { fetcher } from '@/utils/SWRFetcher';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import useSWR from 'swr';

interface ScoreboardPageProps {
  params: {
    id: string;
  };
}

const examModes = ['custom', 'default', 'realistic', 'all', 'new', 'wrong', 'hard'];

const ScoreboardPage: React.FC<ScoreboardPageProps> = ({ params }) => {
  const [mode, setMode] = useState<string>('all');
  const [subjectName, setSubjectName] = useState<string | null>(null);
  const { user } = useSession();

  const { data: scoreboard } = useSWR<Leaderboard>(
    `${BASE_URL}/subjects/${params.id}/scoreboard/${mode}`,
    (url) => fetcher(url, null),
    { revalidateOnFocus: false, keepPreviousData: true }
  );

  useEffect(() => {
    async function fetchSubjectNameById(id: number) {
      const s = await getSubjectNameById(id);
      setSubjectName(s);
    }

    fetchSubjectNameById(parseInt(params.id));
  }, [mode, params.id]);

  return (
    <section className="flex flex-col items-center w-full mt-8">
      <div className="flex flex-col md:flex-row items-center justify-center">
        {examModes.map((m, i) => (
          <button
            key={i}
            className={`${
              mode === m ? 'bg-primary text-white' : 'text-primary'
            } w-40 py-2 capitalize rounded-lg`}
            onClick={() => setMode(m)}>
            {sanitizeMode(m)}
          </button>
        ))}
      </div>

      <p className="px-4 text-xl font-bold text-center uppercase mt-8 mb-5">
        Scoreboard de{' '}
        {subjectName ? (
          <span className="text-primary">{subjectName}</span>
        ) : (
          <Skeleton width={150} />
        )}
      </p>

      {scoreboard !== undefined ? (
        <motion.section className="grid w-full my-5 place-items-center">
          {scoreboard.scores.length === 0 ? (
            <p className="text-center">Sem nenhum utilizador registado</p>
          ) : (
            <>
              <ScoreboardPodium scores={scoreboard.scores} uid={!user ? undefined : user.id} />
              <table className="text-sm text-center">
                <tbody>
                  {scoreboard.scores.slice(3).map((line, key) => (
                    <ScoreboardRow
                      line={line}
                      position={key + 4}
                      key={key}
                      highlight={!!user && user.id === line.user_id}
                    />
                  ))}
                </tbody>
              </table>
            </>
          )}
        </motion.section>
      ) : (
        <Skeleton className="mt-3" height={40} width={600} count={30} />
      )}
      <h3 className="font-bold text-xl md:text-3xl mt-4">
        Total de exames realizados:{' '}
        <span className="text-primary font-bold">{scoreboard?.total}</span>
      </h3>
      <p className="md:text-base text-sm text-slate-500 text-center mx-4 my-4 align-middle">
        Nota: Para estares presente no scoreboard deves pertencer ter respondido, no mínimo, a{' '}
        <span className="font-bold text-primary">{scoreboard?.min_answers}</span> exames e estar
        entre as <span className="font-bold text-primary">{scoreboard?.limit}</span> melhores
        médias.
      </p>
    </section>
  );
};

export default ScoreboardPage;
