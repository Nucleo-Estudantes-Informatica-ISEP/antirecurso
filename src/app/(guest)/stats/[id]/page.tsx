import GradeCalculatorContainer from '@/components/GradeCalculatorContainer';
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
    <section className="w-full h-full flex flex-col items-center justify-center text-center overflow-x-hidden">
      <p className="text-lg w-5/6 md:text-xl font-bold uppercase text-center px-4">
        As tuas <span className="text-primary">estatísticas </span>
        de <span className="text-primary">{subjectName}</span>
      </p>
      <div className="max-w-7xl w-full flex flex-col py-6 px-8 gap-12">
        <section className=" h-full flex flex-col gap-y-6">
          <div className="flex items-center gap-x-2 text-xl bg-gray-100 px-6 py-4 rounded-md">
            <div className="w-12 h-12 flex items-center justify-center">
              <FiInfo className="w-full" />
            </div>
            <p className="text-xs md:text-lg">
              Das <span className="text-primary font-bold">{subjectStats.total_of_questions}</span>{' '}
              questões disponíveis respondeste a{' '}
              <span className="text-primary font-bold">{subjectStats.n_of_answers}</span>, ou seja{' '}
              <span className="text-primary font-bold">
                {((subjectStats.n_of_answers / subjectStats.total_of_questions) * 100).toFixed(1)}%
              </span>
              .
            </p>
          </div>
        </section>

        <div className="flex flex-col md:flex-row gap-y-8 md:gap-6 justify-between items-center px-6 py-4 bg-gray-100 rounded-md">
          <div className="w-full flex flex-col justify-center items-center gap-2">
            <div className="bg-primary text-white rounded-md w-full py-1">
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
          <div className="w-full flex flex-col justify-center items-center gap-2">
            <div className="bg-primary text-white rounded-md w-full py-1">
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

        <div className="py-2 px-1 md:p-2 bg-gray-100 rounded-md w-full relative min-h-[400px]">
          <StatsLineChart
            labels={subjectStats.user_scores.map((score) =>
              new Date(score.created_at).toLocaleDateString('pt-PT')
            )}
            text="Nota do exame"
            data={subjectStats.user_scores.map((score) => (score.score * 20) / 100)}
          />
        </div>

        <GradeCalculatorContainer subjectStats={subjectStats} />
      </div>
    </section>
  );
};

export default SubjectStats;
