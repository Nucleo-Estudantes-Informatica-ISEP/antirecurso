'use client';

import { useRouter } from 'next/navigation';
import swal from 'sweetalert';

interface LogoutButtonProps {
  className?: string;
  onClick?: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ className, onClick }) => {
  const router = useRouter();

  const logoutButtonHandler = async () => {
    if (onClick) onClick();

    const confirmed = await swal({
      title: 'Tens a certeza que queres terminar sessão?',
      icon: 'warning',
      buttons: ['Não', 'Sim'],
      dangerMode: true
    });

    if (!confirmed) return;

    const res = await fetch('/api/auth/logout', {
      method: 'PATCH'
    });

    if (res.status === 200) {
      swal({
        title: 'Terminaste sessão com sucesso!',
        icon: 'success'
      });
      router.push('/');
      router.refresh();
    } else {
      swal({
        title: 'Algo correu mal. Por favor tenta novamente.',
        icon: 'error'
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
