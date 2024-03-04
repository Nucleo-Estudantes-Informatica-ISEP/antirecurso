'use client';

import React, { Dispatch, SetStateAction, useState } from 'react';
import { MD5 } from 'crypto-js';

import useSession from '@/hooks/useSession';
import { BASE_URL } from '@/services/api';
import User from '@/types/User';
import Image from 'next/image';
import LoadingSpinner from '../LoadingSpinner';

interface UserSelectorProps {
  selected: User | null;
  setSelected: Dispatch<SetStateAction<User | null>>;
}

const UserSelector: React.FC<UserSelectorProps> = ({ selected, setSelected }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timeoutVar, setTimeoutVar] = useState<NodeJS.Timeout>();
  const [result, setResult] = useState<User[]>();
  const [controller, setController] = useState<AbortController>();

  const { token } = useSession();

  const queryUsers = async (query: string) => {
    const c = new AbortController();
    setController(c);
    try {
      const res = await fetch(BASE_URL + '/search?query=' + query, {
        headers: { Authorization: 'Bearer ' + token },
        signal: c.signal
      });
      const data = await res.json();
      setController(undefined);
      setResult(data.data);
      setIsLoading(false);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') console.log('request aborted');
    }
  };

  const handleQueryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.trim();

    if (controller) controller.abort();
    if (timeoutVar) clearTimeout(timeoutVar);

    if (query.length < 2) {
      setResult(undefined);
      return setIsLoading(false);
    }

    setIsLoading(true);

    const t = setTimeout(() => queryUsers(query), 500);

    setTimeoutVar(t);
  };

  const handleSelectUser = async (user: User) => {
    setSelected(user);
    setResult(undefined);
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
          <span onClick={() => setSelected(null)} className="cursor-pointer ml-auto text-red-500">
            X
          </span>
        </div>
      ) : (
        <>
          <input
            type="text"
            className="w-full px-1.5 md:px-4 py-2 rounded bg-transparent border"
            onChange={handleQueryChange}
            placeholder="Search"
          />
          <div className="relative">
            {isLoading ? (
              <div className="absolute bg-gray-700 rounded-md w-52 px-4 py-2 text-center">
                <LoadingSpinner className="text-xl mx-auto" />
              </div>
            ) : (
              <div className="absolute bg-gray-700 rounded-md drop-shadow-lg font-bold">
                {result &&
                  (!result.length ? (
                    <div className="w-52 px-4 py-2 text-center">No results.</div>
                  ) : (
                    result?.map((r) => (
                      <div
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
                      </div>
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
