'use client';

import PrimaryButton from '@/components/PrimaryButton';
import { useRouter } from 'next/navigation';
import { useToken } from 'src/hooks/useToken';
import { BASE_URL } from 'src/services/api';

export default function LogoutButton() {
  const router = useRouter();

  const logoutBtnHandler = async () => {
    const { token, setToken } = await useToken();

    // const res = await fetch(BASE_URL + '/auth/logout', {
    //   method: 'POST',
    //   headers: {
    //     Authorization: `Bearer ${token}`
    //   }
    // });

    // if (res.ok) {
    setToken('');
    router.push('/');
    // }
  };

  return (
    <PrimaryButton className="my-16 bg-red-600" onClick={logoutBtnHandler}>
      Terminar Sessão
    </PrimaryButton>
  );
}
