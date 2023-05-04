'use client';

import PrimaryButton from '@/components/PrimaryButton';
import { useRouter } from 'next/navigation';
import { useToken } from 'src/hooks/useToken';
import { BASE_URL } from 'src/services/api';

import swal from 'sweetalert';

export default function LogoutButton() {
  const router = useRouter();

  const logoutBtnHandler = async () => {
    const { token, setToken } = await useToken();

    const confirmed = await swal({
      title: 'Tens a certeza que queres terminar sessão?',
      icon: 'warning',
      buttons: ['Não', 'Sim']
    });

    if (!confirmed) return;

    setToken('');
    router.push('/');
  };

  return (
    <PrimaryButton className="my-16 bg-red-600" onClick={logoutBtnHandler}>
      Terminar Sessão
    </PrimaryButton>
  );
}
