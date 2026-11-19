'use client';

import { useMessages } from '@/i18n/client';

import React, { useState } from 'react';

import { PROTECTED_API_BASE_URL } from '@/services/api';
import { apiRequest } from '@/services/apiClient';
import User from '@/types/User';
import Image from 'next/image';
import useSWR from 'swr';
import LoadingSpinner from '../LoadingSpinner';

type SelectedUser = Pick<User, 'id' | 'name' | 'avatar'>;

interface UserSelectorProps {
  selected: SelectedUser | null;
  setSelected: (user: SelectedUser | null) => void;
}

interface UsersResponse {
  data: User[];
}

const UserSelector: React.FC<UserSelectorProps> = ({ selected, setSelected }) => {
  const t = useMessages();

  const [query, setQuery] = useState<string>('');
  const fetcher = (url: string) => {
    return apiRequest<UsersResponse>(url.toString(), { authenticated: true });
  };

  const { data, isLoading } = useSWR<UsersResponse>(
    query.length ? PROTECTED_API_BASE_URL + `/search?query=${query}` : null,
    fetcher,
    {
      keepPreviousData: true
    }
  );

  const users: User[] | null = data && !!query.length ? data.data : null;

  const handleSelectUser = async (user: User) => {
    setSelected(user);
    setQuery('');
  };

  const handleDeselect = async () => {
    setSelected(null);
    // TODO: focus on input on next rerender
  };

  return (
    <div>
      {selected ? (
        <div className="flex items-center gap-2 px-4 w-full font-bold">
          <Image
            src={`https://gravatar.com/avatar/${selected.avatar}?s=256&d=identicon`}
            alt={selected.name}
            width={32}
            height={32}
            className="rounded-full aspect-square"
          />
          <span className="font-bold">{selected.name}</span>
          <button onClick={handleDeselect} className="cursor-pointer ml-auto text-red-500">
            X
          </button>
        </div>
      ) : (
        <>
          <input
            type="text"
            className="w-full px-1.5 md:px-4 py-2 rounded bg-transparent border"
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('common.search')}
          />
          <div className="relative">
            {isLoading ? (
              <div className="absolute bg-gray-200 dark:bg-gray-700 rounded-md w-52 px-4 py-2 text-center">
                <LoadingSpinner className="text-xl mx-auto" />
              </div>
            ) : (
              <div className="absolute bg-gray-200 dark:bg-gray-700 rounded-md drop-shadow-lg font-bold">
                {users &&
                  (!users.length ? (
                    <div className="w-52 px-4 py-2 text-center">{t('copy.no_results')}</div>
                  ) : (
                    users?.slice(0, 3).map((r: User) => (
                      <button
                        className="flex items-center gap-2 px-4 py-4 w-64 cursor-pointer rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        key={r.id}
                        onClick={() => handleSelectUser(r)}
                      >
                        <Image
                          src={`https://gravatar.com/avatar/${r.avatar}?s=256&d=identicon`}
                          alt={r.name}
                          width={32}
                          height={32}
                          className="rounded-full aspect-square"
                        />
                        <span>{r.name}</span>
                        <span className="text-sm">({r.email})</span>
                      </button>
                    ))
                  ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default UserSelector;
