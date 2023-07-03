import ScoreboardPodium from '@/components/ScoreboardPodium';
import ScoreboardRow from '@/components/ScoreboardRow';
import { cookies } from 'next/headers';
import config from 'src/config';
import { BASE_URL } from 'src/services/api';
import fetchSessionUser from 'src/services/fetchSessionUser';
import Leaderboard from 'src/types/Leaderboard';
import getSubjectNameById from 'src/utils/getSubjectNameById';

interface ScoreboardPageProps {
  params: {
    id: string;
  };
}

// @ts-expect-error Server Component
const ScoreboardPage: React.FC<ScoreboardPageProps> = async ({ params }) => {
  const cookieStore = cookies().get(config.cookies.token) as { value: string } | undefined;
  const token = cookieStore?.value;

  async function fetchLeaderboard(): Promise<Leaderboard> {
    const res = await fetch(`${BASE_URL}/subjects/${params.id}/scoreboard`, {
      cache: 'no-cache'
    });
    return res.json();
  }

  const [subjectName, scoreboard, user] = await Promise.all([
    getSubjectNameById(parseInt(params.id)),
    fetchLeaderboard(),
    fetchSessionUser(token)
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
              uid={user !== null ? user.id : undefined}
            />
            <table className="text-sm text-center">
              <tbody>
                {scoreboard.scores.slice(3).map((line, key) => (
                  <ScoreboardRow
                    line={line}
                    position={key + 4}
                    key={key}
                    highlight={user !== null && user.id === line.user_id}
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
