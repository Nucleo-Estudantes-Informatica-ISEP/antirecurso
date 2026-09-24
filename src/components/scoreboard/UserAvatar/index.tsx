import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserAvatarProps {
  avatar?: string;
  widthValue?: number;
  heightValue?: number;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ avatar }) => {
  return (
    <Avatar className="size-24 md:size-32 ring-4 ring-primary/20">
      <AvatarImage src={`https://gravatar.com/avatar/${avatar}?s=256&d=identicon`} alt="Avatar" />
      <AvatarFallback className="text-2xl">?</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
