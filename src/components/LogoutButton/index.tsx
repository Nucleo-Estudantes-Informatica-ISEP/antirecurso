'use client';

import PrimaryButton from '@/components/PrimaryButton';
import { useRouter } from 'next/navigation';
import swal from 'sweetalert';

const LogoutButton: React.FC = () => {
  const router = useRouter();

  const logoutButtonHandler = async () => {
    const confirmed = await swal({
      title: 'Are you sure you want to logout?',
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
        title: 'Successfully logged out!',
        icon: 'success'
      });
      router.push('/');
    } else {
      swal({
        title: 'There was an error trying to log you out. Please try again.',
        icon: 'error'
      });
    }
  };

  return (
    <PrimaryButton className="my-16 bg-red-500" onClick={logoutButtonHandler}>
      Terminar Sessão
    </PrimaryButton>
  );
};

export default LogoutButton;
