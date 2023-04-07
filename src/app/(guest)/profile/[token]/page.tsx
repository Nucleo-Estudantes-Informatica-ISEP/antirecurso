import { BASE_URL } from 'src/services/api';

interface ProfileProps {
  params: {
    token: string;
  };
}
// @ts-expect-error Server Component
const profile: React.FC<ProfileProps> = async ({ params }) => {
  const res = await fetch(`${BASE_URL}/user`, {
    headers: {
      Authorization: `Bearer ${params.token}`
    },
    cache: 'no-store'
  });
  const user = await res.json();

  const today = new Date().toLocaleDateString('pt-PT');

  return (
    <section className="flex flex-col items-center mt-16">
      <p className="text-xl font-semibold">
        Boas vindas, <span className="font-bold text-primary">{user.name}</span>!
      </p>
      <p className="mt-5 px-5 text-center">Hoje é dia {today}. Tens algum exame perto?</p>

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
              <tr className="bg-white border-b">
                <td className="px-6 py-4">{score.subject}</td>
                <td className="px-6 py-4">{score.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <p className="text-xl font-bold uppercase mt-10">
        Os teus <span className="text-primary">exames</span>
      </p>

      <section className="my-5 md:px-16 w-full grid place-items-center">
        <table className="w-1/2 text-sm text-center">
          <thead className="text-xs text-white uppercase bg-primary">
            <tr>
              <th scope="col" className="px-6 py-3">
                Disciplina
              </th>
              <th scope="col" className="px-6 py-3">
                Pontuação para ranking
              </th>
              <th scope="col" className="px-6 py-3">
                Data
              </th>
            </tr>
          </thead>
          <tbody>
            <h1>Previous Exams</h1>
            {/* @foreach (App\Models\Answer::where(['user_id' => $user->id])->get()->sortByDesc('created_at') as $answer)
                        <tr className="bg-white border-b">
                            <td className="px-6 py-4">
                                <a href="{{ route('exams.checkPrevious', ['slug' => $subject->slug, 'answer' => $answer]) }}" className="underline hover:text-primary transition ease-in-out">{{ $answer->subject->name }}</a>
                            </td>
                            <td className="px-6 py-4">
                                {{ $answer->score }}
                            </td>
                            <td className="px-6 py-4">
                                {{ $answer->created_at->format('d/m/Y') }}
                            </td>
                        </tr>
                    @endforeach */}
          </tbody>
        </table>
      </section>
    </section>
  );
};

export default profile;