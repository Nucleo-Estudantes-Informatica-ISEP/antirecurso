'use client';

import { useEffect, useState } from 'react';

interface ScoreboardPageProps {
  params: {
    slug: string;
  };
}

const ScoreboardPage: React.FC<ScoreboardPageProps> = ({ params }) => {
  const [leaderboardUsers, setUsers] = useState([]);
  const [subjectName, setSubjectName] = useState('');

  function fetchScoreboard() {
    //TODO
  }

  function getSubjectName() {
    //TODO
    setSubjectName('Princípios da Programação');
  }

  useEffect(() => {
    fetchScoreboard();
    getSubjectName();
  }, []);

  return (
    <section className="h-screen flex flex-col items-center mt-32 px-10">
      <p className="text-xl font-bold uppercase">
        Scoreboard de <span className="text-primary">{subjectName}</span>
      </p>

      <section className="mt-10 w-full grid place-items-center">
        {leaderboardUsers.length === 0 ? (
          <p>Sem nenhum utilizador registado</p>
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
              {leaderboardUsers.map((user, key) => (
                <tr className="bg-white border-b">
                  <th scope="row" className="px-6 py-4 font-medium text-primary whitespace-nowrap">
                    {key + 1}
                  </th>
                  {/* <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.score}</td> */}
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
