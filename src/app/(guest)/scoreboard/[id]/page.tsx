import ScoreboardPodium from '@/components/ScoreboardPodium';
import ScoreboardRow from '@/components/ScoreboardRow';
import { cookies } from 'next/headers';
import config from 'src/config';
import { BASE_URL } from 'src/services/api';
import fetchSessionUser from 'src/services/fetchSessionUser';
import Leaderboard from 'src/types/Leaderboard';
import Score from 'src/types/Score';
import User from 'src/types/User';
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
    const res = await fetch(BASE_URL + '/subjects/' + params.id + '/scoreboard', {
      cache: 'no-cache'
    });
    return res.json();
  }

  const promises = [
    getSubjectNameById(parseInt(params.id)),
    fetchLeaderboard(),
    fetchSessionUser(token)
  ];

  const results = await Promise.all(promises);

  const subjectName = results[0];
  const scoreboard = results[1] as Leaderboard;
  const user = results[2] as User;

  return (
    <section className="min-h-[90vh] flex flex-col items-center my-16">
      <p className="text-xl font-bold uppercase text-center px-4">
        Scoreboard de <span className="text-primary">{subjectName}</span>
      </p>

      <section className="my-5 w-full grid place-items-center">
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
