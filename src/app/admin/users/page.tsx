import { getMessages, redirect } from '@/i18n/server';
import UserAvatar from '@/components/scoreboard/UserAvatar';
import { getApiAccessToken } from '@/lib/server-auth';
import { apiRequest, ApiResponseError } from '@/services/apiClient';
import User from '@/types/User';

import React from 'react';

interface UsersResponse {
  data?: User[];
}

const UsersPage: React.FC = async () => {
  const t = await getMessages();

  const token = await getApiAccessToken();

  if (!token) {
    return redirect('/');
  }

  let payload: UsersResponse;
  try {
    payload = await apiRequest<UsersResponse>('users', {
      authenticated: true,
      accessToken: token,
      cache: 'no-store',
      errorMessage: t('copy.failed_to_load_users')
    });
  } catch (error) {
    if (error instanceof ApiResponseError && [401, 403].includes(error.status))
      return redirect('/');
    throw error;
  }

  const users = Array.isArray(payload?.data) ? payload.data : [];

  return (
    <div className="w-full h-full mt-4 flex flex-col items-center justify-center">
      <h2 className="text-4xl font-black">{t('copy.users')}</h2>
      <div className="flex flex-col w-3/4">
        <table className="table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">{t('copy.avatar')}</th>
              <th className="px-4 py-2">{t('copy.id')}</th>
              <th className="px-4 py-2">{t('copy.name')}</th>
              <th className="px-4 py-2">{t('copy.email')}</th>
              <th className="px-4 py-2">{t('copy.type')}</th>
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
