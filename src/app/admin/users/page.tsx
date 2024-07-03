import UserAvatar from '@/components/scoreboard/UserAvatar';
import config from '@/config';
import { BASE_URL } from '@/services/api';
import User from '@/types/User';
import { cookies } from 'next/headers';
import React from 'react';

// @ts-expect-error Server Component
const users: React.FC = async () => {
  const t = cookies().get(config.cookies.token);
  const token = t?.value;
  const res = await fetch(`${BASE_URL}/users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  const users = await res.json();

  return (
    <div className="w-full h-full mt-4 flex flex-col items-center justify-center">
      <h2 className="text-4xl font-black">Users</h2>
      <div className="flex flex-col w-3/4">
        <table className="table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Avatar</th>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Nome</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Tipo</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: User) => (
              <tr key={user.id}>
                <td className="border px-4 py-2">
                  <UserAvatar avatar={user.avatar} widthValue={20} heightValue={20} />
                </td>
                <td className="border px-4 py-2">{user.id}</td>
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.is_admin ? 'Admin' : 'User'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default users;
