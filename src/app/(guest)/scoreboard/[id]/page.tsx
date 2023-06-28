import Image from 'next/image';
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
            <table className="w-1/2 text-sm text-center">
              <tbody>
                {scoreboard.scores.map((line, key) => (
                  // key == 0 as example to highlight the "you" line
                  <tr
                    className={`${key == 0 ? 'bg-orange-200' : ''} text-xl font-bold`}
                    key={line.user_id}>
                    <th scope="row" className="pl-16 pr-6 py-3 whitespace-nowrap rounded-l-full">
                      {key + 1}
                    </th>
                    <td className="pl-4 py-2 min-w-[3.5rem]">
                      <Image
                        className="w-9 rounded-full aspect-square"
                        src="/images/default-avatar.svg"
                        alt={line.user_name}
                        width={40}
                        height={40}
                      />
                    </td>
                    <td className="px-4 py-2 min-w-[28rem]">
                      <div className="flex flex-col items-start">
                        <span className="text-lg leading-5">{line.user_name}</span>
                        <span className="text-sm leading-3 text-gray-500">{line.exams} exames</span>
                      </div>
                    </td>
                    <td className="pl-6 pr-16 py-2 rounded-r-full">{line.score}</td>
                  </tr>
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
