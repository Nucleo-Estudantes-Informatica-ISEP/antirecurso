import ScoreboardPodium from '@/components/ScoreboardPodium';
import ScoreboardRow from '@/components/ScoreboardRow';
import getServerSession from '@/services/getServerSession';
import { BASE_URL } from '@/services/api';
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
    const res = await fetch(`${BASE_URL}/subjects/${params.id}/scoreboard`, {
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
    <section className="flex flex-col items-center w-full my-16">
      <p className="px-4 text-xl font-bold text-center uppercase">
        Scoreboard de <span className="text-primary">{subjectName}</span>
      </p>

      <section className="grid w-full my-5 place-items-center">
        {scoreboard.scores.length === 0 ? (
          <p className="text-center">Sem nenhum utilizador registado</p>
        ) : (
          <>
            {/* Year Selector, future implementation */}
            {/* <div className="flex flex-row justify-end">
              <div className="inline-flex items-center gap-1">
                <p className="text-center">2023</p>
                <MdKeyboardArrowDown />
              </div>
            </div> */}
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
