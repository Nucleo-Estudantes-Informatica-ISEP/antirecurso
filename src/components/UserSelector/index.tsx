'use client';

import React, { Dispatch, SetStateAction, useState } from 'react';
import { MD5 } from 'crypto-js';

import useSession from '@/hooks/useSession';
import { BASE_URL } from '@/services/api';
import User from '@/types/User';
import Image from 'next/image';
import LoadingSpinner from '../LoadingSpinner';
import useSWR from 'swr';

interface UserSelectorProps {
  selected: User | null;
  setSelected: Dispatch<SetStateAction<User | null>>;
}

const UserSelector: React.FC<UserSelectorProps> = ({ selected, setSelected }) => {
  const [query, setQuery] = useState<string>('');

  const fetcher = (url: RequestInfo | URL) => {
    if (!query.length) return;
    return fetch(url, { headers: { Authorization: 'Bearer ' + token } }).then((res) => res.json());
  };

  const { data, isLoading } = useSWR(BASE_URL + `/search?query=${query}`, fetcher, {
    keepPreviousData: true
  });

  const users = data && !!query.length ? data.data : null;

  const { token } = useSession();

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
            src={`https://gravatar.com/avatar/${MD5(
              selected.email.trim().toLowerCase()
            ).toString()}?s=256&d=identicon`}
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
            placeholder="Search"
          />
          <div className="relative">
            {isLoading ? (
              <div className="absolute bg-gray-700 rounded-md w-52 px-4 py-2 text-center">
                <LoadingSpinner className="text-xl mx-auto" />
              </div>
            ) : (
              <div className="absolute bg-gray-700 rounded-md drop-shadow-lg font-bold">
                {users &&
                  (!users.length ? (
                    <div className="w-52 px-4 py-2 text-center">No results.</div>
                  ) : (
                    users?.map((r: User) => (
                      <button
                        className="flex items-center gap-2 px-4 py-4 w-64 cursor-pointer hover:bg-gray-600 transition-colors rounded-md"
                        key={r.id}
                        onClick={() => handleSelectUser(r)}>
                        <Image
                          src={`https://gravatar.com/avatar/${MD5(
                            r.email.trim().toLowerCase()
                          ).toString()}?s=256&d=identicon`}
                          alt={r.name}
                          width={32}
                          height={32}
                          className="rounded-full aspect-square"
                        />
                        <span>{r.name}</span>
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
