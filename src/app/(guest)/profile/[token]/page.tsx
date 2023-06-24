import PreviousExamsTable from '@/components/PreviousExamsTable';
import PrimaryButton from '@/components/PrimaryButton';
import UserProfileScoreboard from '@/components/UserProfileScoreboard';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { BASE_URL } from 'src/services/api';
import User from 'src/types/User';
import swal from 'sweetalert';

interface ProfileProps {
  params: {
    token: string;
  };
}

// @ts-expect-error Server Component
const Profile: React.FC<ProfileProps> = async ({ params }) => {
  const res = await fetch(`${BASE_URL}/user`, {
    headers: {
      Authorization: `Bearer ${params.token}`
    },
    cache: 'no-store'
  });

  if (res.status === 401) {
    await fetch(`${BASE_URL}/logout`, {
      method: 'PATCH'
    });
    swal('Sessão expirada', 'Por favor, inicia sessão novamente.', 'error');
    redirect('/');
  }

  const user = (await res.json()) as User;

  const today = new Date().toLocaleDateString('pt-PT');

  return (
    <section className="h-[90vh] flex flex-col items-center my-16">
      <p className="text-xl font-semibold text-center px-4">
        Boas vindas, <span className="font-bold text-primary">{user.name}</span>!
      </p>
      <p className="px-5 mt-5 text-center">Hoje é dia {today}. Tens algum exame perto?</p>

      {user.scores.length ? (
        <>
          <p className="mt-16 text-lg font-bold text-center uppercase md:text-xl">
            O teu <span className="text-primary">score</span> ao longo das disciplinas
          </p>

          <UserProfileScoreboard user={user} />

          <p className="mt-10 text-lg font-bold uppercase md:text-xl">
            Os teus <span className="text-primary">exames</span>
          </p>

          <PreviousExamsTable token={params.token} />
        </>
      ) : (
        <section className="flex flex-col items-center px-3 mt-12 text-center">
          <p className="text-2xl font-bold">Ainda não realizaste nenhum exame.</p>
          <Link href="/exams" className="mt-10">
            <PrimaryButton>Resolver exames</PrimaryButton>
          </Link>
        </section>
      )}
    </section>
  );
};

export default Profile;
