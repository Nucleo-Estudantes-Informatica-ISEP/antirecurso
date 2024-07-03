import StatsLineChart from '@/components/profile/StatsLineChart';
import UserAvatar from '@/components/scoreboard/UserAvatar';
import getServerSession from '@/services/getServerSession';
import { redirect } from 'next/navigation';
import swal from 'sweetalert';

// @ts-expect-error Server Component
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

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const labels = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <UserAvatar avatar={session.user.avatar} />
      <p className="text-xl font-semibold text-center px-4">
        Bem vindo(a), <span className="font-bold text-primary">{session.user.name}</span>!
      </p>

      <div className="flex flex-col gap-4 mt-8">
        <h2 className="text-xl font-semibold text-center">Atividade de Hoje</h2>
        <div className="flex flex-row gap-x-2">
          <div className="py-4 px-1 md:p-2 bg-gray-100 dark:bg-secondary-dark rounded-md w-full">
            <StatsLineChart labels={labels} data={numbers} text="Número de exames feitos" />
          </div>
          <div className="py-4 px-1 md:p-2 bg-gray-100 dark:bg-secondary-dark rounded-md w-full">
            <StatsLineChart labels={labels} data={numbers} text="Número de comentários" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
