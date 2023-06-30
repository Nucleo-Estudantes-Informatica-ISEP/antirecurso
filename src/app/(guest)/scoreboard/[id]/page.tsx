import { BASE_URL } from 'src/services/api';
import Leaderboard from 'src/types/Leaderboard';
import getSubjectNameById from 'src/utils/getSubjectNameById';

interface ScoreboardPageProps {
  params: {
    id: string;
  };
}

// @ts-expect-error Server Component
const ScoreboardPage: React.FC<ScoreboardPageProps> = async ({ params }) => {
  const subjectName = await getSubjectNameById(parseInt(params.id));
  const scoreboard = await fetchLeaderboard();

  async function fetchLeaderboard(): Promise<Leaderboard> {
    const res = await fetch(BASE_URL + '/subjects/' + params.id + '/scoreboard', {
      cache: 'no-cache'
    });
    return res.json();
  }

  return (
    <section className="min-h-[90vh] flex flex-col items-center my-16">
      <p className="px-4 text-xl font-bold text-center uppercase">
        Scoreboard de <span className="text-primary">{subjectName}</span>
      </p>

      <section className="grid w-full mt-5 md:px-16 place-items-center">
        {scoreboard.scores.length === 0 ? (
          <p className="text-center">Sem nenhum utilizador registado</p>
        ) : (
          <table className="w-1/2 text-sm text-center">
            <thead className="text-xs text-white uppercase bg-primary">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Posição
                </th>
                <th scope="col" className="px-6 py-3">
                  Nome
                </th>
                <th scope="col" className="px-6 py-3">
                  Pontuação
                </th>
              </tr>
            </thead>
            <tbody>
              {scoreboard.scores.map((line, key) => (
                <tr className="bg-white border-b dark:bg-primary-dark" key={line.subject_id}>
                  <th scope="row" className="px-6 py-4 font-medium text-primary whitespace-nowrap">
                    {key + 1}
                  </th>
                  <td className="px-6 py-4">{line.user_name}</td>
                  <td className="px-6 py-4">{line.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </section>
  );
};

export default ScoreboardPage;
