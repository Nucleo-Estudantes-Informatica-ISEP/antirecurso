import UserAvatar from '@/components/scoreboard/UserAvatar';
import { getApiAccessToken } from '@/lib/server-auth';
import { apiRequest, ApiResponseError } from '@/services/apiClient';
import User from '@/types/User';
import { redirect } from 'next/navigation';
import React from 'react';

interface UsersResponse {
  data?: User[];
}

const UsersPage: React.FC = async () => {
  const token = await getApiAccessToken();

  if (!token) {
    redirect('/');
  }

  let payload: UsersResponse;
  try {
    payload = await apiRequest<UsersResponse>('users', {
      authenticated: true,
      accessToken: token,
      cache: 'no-store',
      errorMessage: 'Failed to load users'
    });
  } catch (error) {
    if (error instanceof ApiResponseError && [401, 403].includes(error.status)) redirect('/');
    throw error;
  }

  const users = Array.isArray(payload?.data) ? payload.data : [];

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

export default UsersPage;
