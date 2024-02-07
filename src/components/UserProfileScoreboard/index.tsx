'use client';

import useSession from '@/hooks/useSession';
import { BASE_URL } from '@/services/api';
import { Eye, EyeSplash } from '@/styles/Icons';
import Link from 'next/link';
import React from 'react';
import User from 'src/types/User';
import swal from 'sweetalert';

interface UsePreviousExamsTableProps {
  user: User;
}

const UserProfileScoreboard: React.FC<UsePreviousExamsTableProps> = ({ user }) => {
  const { token } = useSession();
  const [scores, setScores] = React.useState(user.scores);

  async function handleVisibilityChange(subjectId: number, show_scoreboard: boolean) {
    swal({
      title: 'Tens a certeza que queres alterar a visibilidade?',
      text: 'Isto irá alterar a visibilidade do teu score para os outros utilizadores.',
      icon: 'warning',
      buttons: ['Cancelar', 'Sim, alterar'],
      dangerMode: true
    }).then(async (willChange) => {
      if (!willChange) return;

      const res = await fetch(`${BASE_URL}/subjects/${subjectId}/scoreboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ visibility: !show_scoreboard })
      });
      if (!res.ok) {
        swal('Ocorreu um erro ao alterar a visibilidade!', {
          icon: 'error'
        });
        return;
      }
      swal('A visibilidade foi alterada com sucesso!', {
        icon: 'success'
      });
      const s = scores.map((score) => {
        if (score.subject_id === subjectId) {
          score.show_scoreboard = !show_scoreboard;
        }
        return score;
      });
      setScores(s);
    });
  }
  return (
    <section className="grid w-full mt-5 md:px-16 place-items-center px-6">
      <table className="w-full lg:w-1/2 text-sm text-center">
        <thead className="text-xs text-white uppercase bg-primary">
          <tr>
            <th scope="col" className="w-1/3 px-6 py-3">
              Disciplina
            </th>
            <th scope="col" className="w-1/6 px-3 py-3">
              Pontuação
            </th>
            <th scope="col" className="w-1/12 px-2 py-3">
              Visível
            </th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score) => (
            <tr className="bg-white border-b dark:bg-primary-dark" key={score.subject_id}>
              <td className="px-6 py-4 capitalize">
                <Link
                  href={`/stats/${score.subject_id}`}
                  className="text-xs underline capitalize transition ease-in-out hover:text-primary md:text-base">
                  {score.subject}
                </Link>
              </td>
              <td className="px-3 py-4 w-1/6">{score.score}</td>
              <td className="px-2 py-4 w-1/12">
                <button
                  onClick={() => handleVisibilityChange(score.subject_id, score.show_scoreboard)}
                  className="text-lg mx-auto">
                  {score.show_scoreboard ? <Eye /> : <EyeSplash />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default UserProfileScoreboard;
