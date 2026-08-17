'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import useSession from '@/hooks/useSession';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import swal from 'sweetalert';

interface LogoutButtonProps {
  className?: string;
  onClick?: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ className, onClick }) => {
  const session = useSession();
  const router = useRouter();
  const { theme } = useTheme();

  const logoutButtonHandler = async () => {
    if (onClick) onClick();

    const confirmed = await swal({
      title: 'Tens a certeza que queres terminar sessão?',
      icon: 'warning',
      buttons: ['Não', 'Sim'],
      dangerMode: true,
      className: theme === 'dark' ? 'swal-dark' : ''
    });

    if (!confirmed) return;

    const res = await fetch('/api/auth/logout', { method: 'PATCH' });

    if (res.status === 200) {
      const { url } = (await res.json()) as { url?: string };

      await signOut({ redirect: false });
      session.clear();
      swal({
        title: 'Terminaste sessão com sucesso!',
        icon: 'success',
        timer: 2000,
        className: theme === 'dark' ? 'swal-dark' : ''
      });
      if (url) {
        window.location.href = url;
        return;
      }

      router.push('/');
      router.refresh();
    } else {
      swal({
        title: 'Algo correu mal. Por favor tenta novamente.',
        icon: 'error',
        className: theme === 'dark' ? 'swal-dark' : ''
      });
      router.refresh();
    }
  };

  return (
    <Button
      variant="outline"
      className={cn('text-destructive hover:text-destructive', className)}
      onClick={logoutButtonHandler}
    >
      <LogOut className="size-4" />
      Terminar sessão no AuthNEI
    </Button>
  );
};

export default LogoutButton;
