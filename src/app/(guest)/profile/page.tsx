import PreviousExamsTable from '@/components/PreviousExamsTable';
import PrimaryButton from '@/components/PrimaryButton';
import UserAvatar from '@/components/UserAvatar';
import UserProfileScoreboard from '@/components/UserProfileScoreboard';
import getServerSession from '@/services/getServerSession';
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface ProfileProps {
  params: {
    token: string;
  };
}

// @ts-expect-error Server Component
const Profile: React.FC<ProfileProps> = async () => {
  const session = await getServerSession();
  if (!session) redirect('/');

  const { token, user } = session;

  const today = new Date().toLocaleDateString('pt-PT');

  return (
    <section className="w-full flex flex-col items-center my-8">
      <p className="md:text-2xl text-xl font-bold uppercase text-center px-4">
        O teu <span className="text-primary">perfil</span>
      </p>

      <UserAvatar avatar={user.avatar} />

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

          <PreviousExamsTable token={token} />
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
