'use client';

import useSession from '@/hooks/useSession';
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

    const res = await fetch('/api/auth/logout', {
      method: 'PATCH'
    });

    if (res.status === 200) {
      session.clear();
      swal({
        title: 'Terminaste sessão com sucesso!',
        icon: 'success',
        timer: 2000,
        className: theme === 'dark' ? 'swal-dark' : ''
      });
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
    <button className={`text-red-600 ${className}`} onClick={logoutButtonHandler}>
      Terminar Sessão
    </button>
  );
};

export default LogoutButton;
