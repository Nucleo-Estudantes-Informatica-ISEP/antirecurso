import PreviousExamsTable from '@/components/PreviousExamsTable';
import PrimaryButton from '@/components/PrimaryButton';
import Link from 'next/link';
import { BASE_URL } from 'src/services/api';
import User from 'src/types/User';

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
  const user = (await res.json()) as User;

  const today = new Date().toLocaleDateString('pt-PT');

  return (
    <section className="h-[90vh] flex flex-col items-center mt-16">
      <p className="text-xl font-semibold">
        Boas vindas, <span className="font-bold text-primary">{user.name}</span>!
      </p>
      <p className="mt-5 px-5 text-center">Hoje é dia {today}. Tens algum exame perto?</p>

      {user.scores.length ? (
        <>
          <p className="text-xl font-bold uppercase mt-16 text-center">
            O teu <span className="text-primary">score</span> ao longo das disciplinas
          </p>

          <section className="mt-5 md:px-16 w-full grid place-items-center">
            <table className="w-1/2 text-sm text-center">
              <thead className="text-xs text-white uppercase bg-primary">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Disciplina
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Pontuação
                  </th>
                </tr>
              </thead>
              <tbody>
                {user.scores.map((score) => (
                  <tr className="bg-white border-b" key={score.subject_id}>
                    <td className="px-6 py-4">{score.subject.toUpperCase()}</td>
                    <td className="px-6 py-4">{score.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <p className="text-xl font-bold uppercase mt-10">
            Os teus <span className="text-primary">exames</span>
          </p>

          <PreviousExamsTable token={params.token} />
        </>
      ) : (
        <section className="flex flex-col items-center text-center px-3 mt-12">
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
