'use client';

import Link from 'next/link';
import React from 'react';
import User from 'src/types/User';

interface UsePreviousExamsTableProps {
  user: User;
}

const UserProfileScoreboard: React.FC<UsePreviousExamsTableProps> = ({ user }) => {
  return (
    <section className="mt-5 w-full md:px-16 grid place-items-center">
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
            <tr className="bg-white border-b" key={score.subject_id}>
              <td className="px-6 py-4 capitalize">
                <Link
                  href={`/stats/${score.subject_id}`}
                  className="hover:text-primary underline text-xs md:text-base transition ease-in-out capitalize">
                  {score.subject}
                </Link>
              </td>
              <td className="px-6 py-4">{score.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default UserProfileScoreboard;
