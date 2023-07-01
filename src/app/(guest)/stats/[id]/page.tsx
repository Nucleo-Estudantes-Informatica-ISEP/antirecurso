import GradeCalculator from '@/components/GradeCalculator';
import StatsLineChart from '@/components/StatsLineChart';
import StatsPieChart from '@/components/StatsPieChart';
import { cookies } from 'next/headers';
import { FiInfo } from 'react-icons/fi';
import config from 'src/config';
import { BASE_URL } from 'src/services/api';
import ISubjectStats from 'src/types/SubjectStats';
import getSubjectNameById from 'src/utils/getSubjectNameById';

interface SubjectStatsProps {
  params: {
    id: number;
  };
}

// @ts-expect-error Server Component
const SubjectStats: React.FC<SubjectStatsProps> = async ({ params }) => {
  const subjectName = await getSubjectNameById(params.id);
  const t = cookies().get(config.cookies.token);
  const token = t?.value;

  const res = await fetch(`${BASE_URL}/subjects/${params.id}/stats`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    cache: 'no-store'
  });
  const subjectStats: ISubjectStats = await res.json();

  return (
    <section className="flex flex-col items-center justify-center w-full h-full overflow-x-hidden text-center">
      <p className="w-5/6 px-4 text-lg font-bold text-center uppercase md:text-xl">
        As tuas <span className="text-primary">estatísticas </span>
        de <span className="text-primary">{subjectName}</span>
      </p>
      <div className="flex flex-col w-full gap-12 px-8 py-6 max-w-7xl">
        <section className="flex flex-col h-full gap-y-6">
          <div className="flex items-center px-6 py-4 text-xl bg-gray-100 rounded-md gap-x-2 dark:bg-secondary-dark">
            <div className="flex items-center justify-center w-12 h-12">
              <FiInfo className="w-full" />
            </div>
            <p className="text-xs md:text-lg">
              Das <span className="font-bold text-primary">{subjectStats.total_of_questions}</span>{' '}
              questões disponíveis respondeste a{' '}
              <span className="font-bold text-primary">{subjectStats.n_of_answers}</span>, ou seja{' '}
              <span className="font-bold text-primary">
                {((subjectStats.n_of_answers / subjectStats.total_of_questions) * 100).toFixed(1)}%
              </span>
              .
            </p>
          </div>
        </section>

        <div className="flex flex-col items-center justify-between px-6 py-4 bg-gray-100 rounded-md md:flex-row gap-y-8 md:gap-6 dark:bg-secondary-dark">
          <div className="flex flex-col items-center justify-center w-full gap-2">
            <div className="w-full py-1 text-white rounded-md bg-primary">
              <p>Número de Exames</p>
            </div>
            <StatsPieChart
              labels={['Aprovado', 'Reprovado']}
              text="Nº de exames"
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
              data={[
                subjectStats.n_of_correct,
                subjectStats.n_of_wrong_answers,
                subjectStats.total_of_questions - subjectStats.n_of_answers
              ]}
            />
          </div>
        </div>

        <div className="py-2 px-1 md:p-2 bg-gray-100 dark:bg-secondary-dark rounded-md w-full relative min-h-[400px]">
          <StatsLineChart
            labels={subjectStats.user_scores.map((score) =>
              new Date(score.created_at).toLocaleDateString('pt-PT')
            )}
            text="Nota do exame"
            data={subjectStats.user_scores.map((score) => (score.score * 20) / 100)}
          />
        </div>
        <GradeCalculator
          examGrade={parseInt(subjectStats.average_grade)}
          weight={subjectStats.exam_weight}
          minGrade={subjectStats.min_grade}
        />
      </div>
    </section>
  );
};

export default SubjectStats;
