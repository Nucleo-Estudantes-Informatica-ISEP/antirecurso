import GradeCalculator from '@/components/GradeCalculator';
import StatsLineChart from '@/components/StatsLineChart';
import StatsPieChart from '@/components/StatsPieChart';
import { cookies } from 'next/headers';
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
    cache: 'no-cache'
  });
  const subjectStats: ISubjectStats = await res.json();

  return (
    <section className="h-full w-full flex flex-col items-center justify-center text-center">
      <p className="text-lg w-5/6 md:text-xl font-bold uppercase text-center px-4">
        As tuas <span className="text-primary">estatísticas </span>
        de <span className="text-primary">{subjectName}</span>
      </p>
      <div className="flex items-center w-full">
        <section className="w-1/2 px-4 md:px-8 my-6 md:my-12 h-full flex flex-col gap-y-6">
          <div className="flex items-center gap-x-2 text-xl">
            <h2 className="text-primary font-bold">Total de questões respondidas: </h2>
            <p className="">{subjectStats.n_of_answers}</p>
          </div>
          <div className="flex items-center gap-x-2 text-xl">
            <h2 className="text-primary font-bold">Total de questões disponíveis: </h2>
            <p className="">{subjectStats.total_of_questions}</p>
          </div>
        </section>
        <section className="w-1/2">
          <StatsPieChart
            labels={['Aprovado', 'Reprovado']}
            text="Nº de exames"
            data={[
              subjectStats.n_of_exams_passed,
              subjectStats.n_of_exams_taken - subjectStats.n_of_exams_passed
            ]}
          />
          <StatsPieChart
            labels={['Corretas', 'Incorretas']}
            text="Nº de questões"
            data={[subjectStats.n_of_correct, subjectStats.n_of_wrong_answers]}
          />
          <StatsLineChart
            labels={subjectStats.user_scores.map((score) =>
              new Date(score.created_at).toLocaleDateString('pt-PT')
            )}
            text="Score"
            data={subjectStats.user_scores.map((score) => score.score)}
          />
        </section>

        <GradeCalculator
          examGrade={parseInt(subjectStats.average_grade)}
          weight={subjectStats.exam_weight}
        />
      </div>
    </section>
  );
};

export default SubjectStats;
