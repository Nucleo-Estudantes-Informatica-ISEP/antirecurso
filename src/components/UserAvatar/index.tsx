'use client';

import { AnimationProps, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface UserAvatarProps {
  avatar: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ avatar }) => {
  const animation: AnimationProps = {
    variants: {
      initial: { opacity: 0 },
      hover: { opacity: 1 }
    },
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  };

  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      className="flex flex-col items-center relative hover:cursor-pointer md:w-40 md:h-40 w-24 h-24 my-6 rounded-full">
      <Image
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDI1NiAyNTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAw"
        width={328}
        height={328}
        src={`https://gravatar.com/avatar/${avatar}?s=256&d=identicon`}
        alt="Avatar"
        className="w-full h-full rounded-full"
      />
      <Link
        href="https://en.gravatar.com/gravatars/new/computer"
        target="_blank"
        rel="noreferrer"
        className="w-full h-full rounded-full absolute top-0 left-0 flex justify-center items-center text-white text-sm z-20">
        <motion.div
          {...animation}
          className="w-full h-full rounded-full absolute top-0 left-0 bg-primary bg-opacity-70"
        />
        <motion.span
          {...animation}
          className="z-10 text-white text-center text-sm leading-3 md:text-lg font-bold">
          Alterar avatar
        </motion.span>
      </Link>
    </motion.div>
  );
};

export default UserAvatar;
