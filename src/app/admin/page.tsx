import BarChart from '@/components/charts/BarChart';
import UserAvatar from '@/components/scoreboard/UserAvatar';
import { BASE_URL } from '@/services/api';
import getServerSession from '@/services/getServerSession';
import { AdminExamsStats } from '@/types/AdminExamsStats';
import { redirect } from 'next/navigation';
import swal from 'sweetalert';

const AdminPage: React.FC = async () => {
  const session = await getServerSession();

  if (session === null) {
    swal({
      title: 'Acesso negado',
      text: 'Ocorreu um erro',
      icon: 'error'
    });
    redirect('/');
  }

  const res = await fetch(`${BASE_URL}/admin/exams`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${session.token}`
    }
  });

  const data = (await res.json()) as AdminExamsStats;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <UserAvatar avatar={session.user.avatar} />
      <p className="text-xl font-semibold text-center px-4">
        Bem vindo(a), <span className="font-bold text-primary">{session.user.name}</span>!
      </p>

      <div className="flex flex-col gap-4 mt-8 size-full">
        <h2 className="text-xl font-semibold text-center">Atividade de Hoje</h2>
        <div className="flex flex-row gap-x-2 gap-y-6 flex-wrap items-center justify-center size-full">
          <div className="py-4 px-1 md:p-2 bg-gray-100 dark:bg-secondary-dark rounded-md size-3/4">
            <BarChart
              title="Nº de exames feitos no dia"
              labels={data?.exams_per_day.map((item) => item.date) || []}
              data={data?.exams_per_day.map((item) => item.count) || []}
            />
          </div>
          <div className="py-4 px-1 md:p-2 bg-gray-100 dark:bg-secondary-dark rounded-md size-3/4">
            <BarChart
              title="Nº de exames por modo"
              labels={data?.exams_per_mode.map((item) => item.mode) || []}
              data={data?.exams_per_mode.map((item) => item.count) || []}
            />
          </div>
          <div className="py-4 px-1 md:p-2 bg-gray-100 dark:bg-secondary-dark rounded-md size-3/4">
            <BarChart
              title="Nº de exames por UC"
              labels={data?.exams_per_subject.map((item) => item.name) || []}
              data={data?.exams_per_subject.map((item) => item.count) || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
