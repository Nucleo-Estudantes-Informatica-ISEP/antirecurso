'use client';

import GradeCalculatorContainer from '@/components/profile/GradeCalculatorContainer';
import ScoreIndicator from '@/components/profile/ScoreIndicator';
import StatsLineChart from '@/components/profile/StatsLineChart';
import StatsPieChart from '@/components/profile/StatsPieChart';
import useSession from '@/hooks/useSession';
import { sanitizeMode } from '@/utils/sanitizeMode';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiInfo, FiSettings } from 'react-icons/fi';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { BASE_URL } from 'src/services/api';
import SubjectStats from 'src/types/SubjectStats';
import getSubjectNameById from 'src/utils/getSubjectNameById';

interface SubjectStatsProps {
  params: {
    id: number;
  };
}

const SubjectStats: React.FC<SubjectStatsProps> = ({ params }) => {
  const [subjectName, setSubjectName] = useState('');
  const [subjectStats, setSubjectStats] = useState<SubjectStats>();
  const { token } = useSession();

  useEffect(() => {
    async function getSubjectStats() {
      const sName = await getSubjectNameById(params.id);
      setSubjectName(sName);

      const res = await fetch(`${BASE_URL}/subjects/${params.id}/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        cache: 'no-store'
      });
      const sStats: SubjectStats = await res.json();
      setSubjectStats(sStats);
    }

    getSubjectStats();
  }, [params.id, token]);

  return (
    <section className="flex flex-col items-center justify-center w-full h-full overflow-x-hidden text-center mt-6">
      <p className="w-5/6 px-4 text-lg font-bold text-center uppercase md:text-xl my-5">
        As tuas <span className="text-primary">estatísticas </span>
        de <span className="text-primary">{subjectName}</span>
      </p>
      <div className="flex flex-col w-full gap-12 px-8 py-6 max-w-[1440px]">
        <div className="flex flex-col md:flex-row justify-between h-full gap-6">
          <div className="flex flex-col justify-between items-stretch h-full gap-y-6">
            <section className="flex flex-col">
              <div className="flex items-center px-6 py-4 text-xl bg-gray-100 rounded-md gap-x-2 dark:bg-secondary-dark text-left">
                <div className="flex items-center justify-center w-12 h-12">
                  <FiInfo className="w-full" />
                </div>
                {subjectStats === undefined ? (
                  <Skeleton width={800} />
                ) : (
                  <p className="text-xs md:text-lg align-middle">
                    Já respondeste a {subjectStats.n_of_exams_taken} exames. Das{' '}
                    <span className="font-bold text-primary">
                      {subjectStats.total_of_questions}
                    </span>{' '}
                    questões disponíveis respondeste a{' '}
                    <span className="font-bold text-primary">{subjectStats.n_of_answers}</span>, ou
                    seja{' '}
                    <span className="font-bold text-primary">
                      {(
                        (subjectStats.n_of_answers / subjectStats.total_of_questions) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                    . Demoras, em média, cerca de{' '}
                    <span className="font-bold text-primary align-middle">
                      {Math.floor(subjectStats.mean_time / 60) > 0
                        ? `${Math.floor(subjectStats.mean_time / 60)} minutos e`
                        : ''}{' '}
                      {Math.floor(subjectStats.mean_time % 60)} segundos
                    </span>{' '}
                    a responder a um exame.
                  </p>
                )}
              </div>
            </section>

            <section className="flex flex-col">
              <div className="flex items-center px-6 py-4 text-xl bg-gray-100 rounded-md gap-x-2 dark:bg-secondary-dark text-left">
                <div className="flex items-center justify-center w-12 h-12">
                  <FiSettings className="w-full" />
                </div>
                {subjectStats === undefined ? (
                  <Skeleton width={800} />
                ) : (
                  <p className="text-xs md:text-lg">
                    Com base nos exames que respondeste, sugerimos-te que resolvas um exame do{' '}
                    <Link
                      href={`/exams/${params.id}/answer/${subjectStats.suggested_mode}`}
                      className="font-bold text-primary align-middle">
                      modo {sanitizeMode(subjectStats.suggested_mode)}
                    </Link>{' '}
                    para continuares a melhorar.
                  </p>
                )}
              </div>
            </section>
          </div>

          <div className="flex items-center justify-center px-12 py-5 bg-gray-100 rounded-md dark:bg-secondary-dark row-span-2">
            {subjectStats === undefined ? (
              <Skeleton width={150} height={150} circle={true} />
            ) : (
              <ScoreIndicator score={Number.parseFloat(subjectStats.average_grade)} />
            )}
          </div>
          <div className="flex items-center w-full px-4 py-6 md:max-w-xs bg-gray-100 rounded-md dark:bg-secondary-dark row-span-2 flex-col justify-between">
            <h2 className="text-xl md:text-3xl uppercase text-primary font-semibold">Ranking</h2>
            {subjectStats === undefined ? (
              <Skeleton width={150} height={150} circle={true} />
            ) : subjectStats.place_in_scoreboard === null ? (
              <span className="text-center text-base">Não tens posição no scoreboard.</span>
            ) : (
              <div>
                <span className="text-center font-black text-3xl md:text-5xl lg:text-7xl">
                  # {subjectStats.place_in_scoreboard}
                </span>
              </div>
            )}
            <div />
          </div>
        </div>

        {subjectStats === undefined ? (
          <Skeleton width={1000} height={100} />
        ) : (
          <div className="flex flex-col items-center justify-between p-6 bg-gray-100 rounded-md md:flex-row gap-y-8 md:gap-6 dark:bg-secondary-dark">
            <div className="flex flex-col items-center justify-center w-full gap-2">
              <div className="w-full py-1 text-white rounded-md bg-primary">
                <p>Número de Exames</p>
              </div>
              <StatsPieChart
                labels={['Aprovado', 'Reprovado']}
                text="Nº de exames"
                backgroundColor={['rgba(50, 229, 50, 0.8)', 'rgba(255, 22, 12, 0.8)']}
                borderColor={['rgba(55, 220, 2, 1)', 'rgba(255, 22, 12, 1)']}
                data={[
                  subjectStats.n_of_exams_passed,
                  subjectStats.n_of_exams_taken - subjectStats.n_of_exams_passed
                ]}
              />
            </div>
            <div className="flex flex-col items-center justify-center w-full gap-2">
              <div className="w-full py-1 text-white rounded-md bg-primary">
                <p>Número de Questões</p>
              </div>
              <StatsPieChart
                labels={['Corretas', 'Incorretas', 'Não respondidas']}
                text="Nº de questões"
                backgroundColor={[
                  'rgba(50, 229, 50, 0.8)',
                  'rgba(255, 22, 12, 0.8)',
                  'rgba(100, 100, 100, 0.8)'
                ]}
                borderColor={[
                  'rgba(55, 220, 2, 1)',
                  'rgba(255, 22, 12, 1)',
                  'rgba(100, 100, 100, 1)'
                ]}
                data={[
                  subjectStats.n_of_correct,
                  subjectStats.n_of_wrong_answers,
                  subjectStats.total_of_questions - subjectStats.n_of_answers
                ]}
              />
            </div>
            <div className="flex flex-col items-center justify-center w-full gap-2">
              <div className="w-full py-1 text-white rounded-md bg-primary">
                <p>Tipo de Exame</p>
              </div>
              <StatsPieChart
                labels={Object.keys(subjectStats.mode_scores).map(
                  (mode) => sanitizeMode(mode).charAt(0).toUpperCase() + sanitizeMode(mode).slice(1)
                )}
                backgroundColor={[
                  'rgba(50, 229, 50, 0.8)',
                  'rgba(170, 0, 180, 0.8)',
                  'rgba(180, 22, 12, 0.8)',
                  'rgba(100, 100, 100, 0.8)',
                  'rgba(180, 180, 0, 0.8)',
                  'rgba(0, 200, 200, 0.8)'
                ]}
                borderColor={[
                  'rgba(55, 220, 2, 1)',
                  'rgba(180, 0, 180, 1)',
                  'rgba(180, 22, 12, 1)',
                  'rgba(100, 100, 100, 1)',
                  'rgba(180, 180, 0, 1)',
                  'rgba(0, 180, 180, 1)'
                ]}
                text="Nº de exames"
                data={Object.values(subjectStats.mode_scores)}
              />
            </div>
          </div>
        )}

        {subjectStats === undefined ? (
          <Skeleton width={500} height={100} />
        ) : (
          <>
            <div className="py-2 px-1 md:p-2 bg-gray-100 dark:bg-secondary-dark rounded-md w-full relative min-h-[400px]">
              <StatsLineChart
                labels={subjectStats.user_scores.map((score) =>
                  new Date(score.created_at).toLocaleDateString('pt-PT')
                )}
                text="Nota do exame"
                data={subjectStats.user_scores.map((score) => (score.score * 20) / 100)}
              />
            </div>
            <GradeCalculatorContainer subjectStats={subjectStats} />
          </>
        )}
      </div>
    </section>
  );
};

export default SubjectStats;
