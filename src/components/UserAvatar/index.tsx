'use client';

import { useState } from 'react';

import Link from 'next/link';

interface UserAvatarProps {
  avatar: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ avatar }) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      onMouseOver={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="flex flex-col items-center relative hover:cursor-pointer md:w-36 md:h-36 w-20 h-20 my-6">
      <img
        src={`https://gravatar.com/avatar/${avatar}?s=256&d=identicon`}
        alt="Avatar"
        className="w-full h-full rounded-full"
      />
      {isHovering && (
        <Link
          href="https://en.gravatar.com/gravatars/new/computer"
          target="_blank"
          rel="noreferrer"
          className="w-full h-full rounded-full absolute top-0 left-0 flex justify-center items-center text-white text-sm z-20">
          <div className="w-full h-full rounded-full absolute top-0 left-0 bg-primary bg-opacity-70" />
          <span className="z-10 text-white text-center text-sm md:text-lg font-bold">
            Alterar avatar
          </span>
        </Link>
      )}
    </div>
  );
};

export default UserAvatar;
