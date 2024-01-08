import ScoreboardPodium from '@/components/ScoreboardPodium';
import ScoreboardRow from '@/components/ScoreboardRow';
import { BASE_URL } from '@/services/api';
import getServerSession from '@/services/getServerSession';
import Leaderboard from '@/types/Leaderboard';
import getSubjectNameById from '@/utils/getSubjectNameById';

interface ScoreboardPageProps {
  params: {
    id: string;
  };
}

// @ts-expect-error Server Component
const ScoreboardPage: React.FC<ScoreboardPageProps> = async ({ params }) => {
  async function fetchLeaderboard(): Promise<Leaderboard> {
    const res = await fetch(`${BASE_URL}/subjects/${params.id}/scoreboard/all`, {
      cache: 'no-cache'
    });
    return res.json();
  }

  const [subjectName, scoreboard, session] = await Promise.all([
    getSubjectNameById(parseInt(params.id)),
    fetchLeaderboard(),
    getServerSession()
  ]);

  return (
    <section className="flex flex-col items-center w-full mt-8">
      <p className="px-4 text-xl font-bold text-center uppercase my-5">
        Scoreboard de <span className="text-primary">{subjectName}</span>
      </p>

      <section className="grid w-full my-5 place-items-center">
        {scoreboard.scores.length === 0 ? (
          <p className="text-center">Sem nenhum utilizador registado</p>
        ) : (
          <>
            <ScoreboardPodium
              scores={scoreboard.scores}
              uid={!session ? undefined : session.user.id}
            />
            <table className="text-sm text-center">
              <tbody>
                {scoreboard.scores.slice(3).map((line, key) => (
                  <ScoreboardRow
                    line={line}
                    position={key + 4}
                    key={key}
                    highlight={!!session && session.user.id === line.user_id}
                  />
                ))}
              </tbody>
            </table>
          </>
        )}
      </section>
    </section>
  );
};

export default ScoreboardPage;
