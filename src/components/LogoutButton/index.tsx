'use client';

import PrimaryButton from '@/components/PrimaryButton';
import { useRouter } from 'next/navigation';
import swal from 'sweetalert';

const LogoutButton: React.FC = () => {
  const router = useRouter();

  const logoutButtonHandler = async () => {
    const confirmed = await swal({
      title: 'Tens a certeza que queres terminar sessão?',
      icon: 'warning',
      buttons: ['No', 'Yes'],
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
    } else {
      swal({
        title: 'Algo correu mal. Por favor tenta novamente.',
        icon: 'error'
      });
    }
  };

  return (
    <PrimaryButton className="mb-4 text-white bg-primary" onClick={logoutButtonHandler}>
      Terminar Sessão
    </PrimaryButton>
  );
};

export default LogoutButton;
