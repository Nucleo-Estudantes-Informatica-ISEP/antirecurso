import ScoreboardPodium from '@/components/ScoreboardPodium';
import ScoreboardRow from '@/components/ScoreboardRow';
import { BASE_URL } from 'src/services/api';
import Leaderboard from 'src/types/Leaderboard';
import Score from 'src/types/Score';
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

  const example: Score = {
    user_id: 1000,
    score: 51.56,
    user_name: 'Alguém (You)',
    subject_id: 1,
    subject: 'algan',
    exams: 5
  };

  return (
    <section className="min-h-[90vh] flex flex-col items-center my-16">
      <p className="text-xl font-bold uppercase text-center px-4">
        Scoreboard de <span className="text-primary">{subjectName}</span>
      </p>

      <section className="mt-5 w-full md:px-16 grid place-items-center">
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
            <ScoreboardPodium />
            <table className="w-1/2 text-sm text-center">
              <tbody>
                <ScoreboardRow line={example} position={25} highlight />
                {scoreboard.scores.map((line, key) => (
                  <ScoreboardRow line={line} position={key + 1} key={key} />
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
