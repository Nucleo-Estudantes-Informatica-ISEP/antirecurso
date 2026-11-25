'use client';

import { useRef, useState } from 'react';
import { useMessages } from '@/i18n/client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import SignOutDialog from '../SignOutDialog';
import { LogOut } from 'lucide-react';

interface LogoutButtonProps {
  className?: string;
  onClick?: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ className, onClick }) => {
  const t = useMessages();
  const [signOutOpen, setSignOutOpen] = useState(false);
  const signOutTrigger = useRef<HTMLButtonElement>(null);

  const logoutButtonHandler = () => {
    onClick?.();
    setSignOutOpen(true);
  };

  return (
    <>
      <Button
        ref={signOutTrigger}
        variant="outline"
        className={cn('text-destructive hover:text-destructive', className)}
        onClick={logoutButtonHandler}
      >
        <LogOut className="size-4" />
        {t('auth.logout')}
      </Button>
      <SignOutDialog open={signOutOpen} onOpenChange={setSignOutOpen} triggerRef={signOutTrigger} />
    </>
  );
};

export default LogoutButton;
