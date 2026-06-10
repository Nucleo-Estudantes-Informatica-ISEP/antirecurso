'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import Link from 'next/link';

interface UserAvatarProps {
  avatar?: string;
  widthValue?: number;
  heightValue?: number;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ avatar }) => {
  return (
    <Link
      href="https://en.gravatar.com/gravatars/new/computer"
      target="_blank"
      rel="noreferrer"
      className="relative group"
    >
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.2 }}
        className="relative"
      >
        <Avatar className="size-24 md:size-32 ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all">
          <AvatarImage
            src={`https://gravatar.com/avatar/${avatar}?s=256&d=identicon`}
            alt="Avatar"
          />
          <AvatarFallback className="text-2xl">?</AvatarFallback>
        </Avatar>
        <div className="absolute inset-0 rounded-full bg-primary/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs md:text-sm font-semibold gap-1">
          <Camera className="size-5 md:size-6" />
          <span>Alterar</span>
        </div>
      </motion.div>
    </Link>
  );
};

export default UserAvatar;
