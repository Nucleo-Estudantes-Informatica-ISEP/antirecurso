'use client';
import { useMessages } from '@/i18n/client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import useAuthNeiSignOut from '@/hooks/useAuthNeiSignOut';
import { LogOut } from 'lucide-react';

interface LogoutButtonProps {
  className?: string;
  onClick?: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ className, onClick }) => {
  const t = useMessages();
  const signOut = useAuthNeiSignOut();

  const logoutButtonHandler = async () => {
    onClick?.();
    await signOut();
  };

  return (
    <Button
      variant="outline"
      className={cn('text-destructive hover:text-destructive', className)}
      onClick={logoutButtonHandler}
    >
      <LogOut className="size-4" />
      {t('auth.logout')}
    </Button>
  );
};

export default LogoutButton;
