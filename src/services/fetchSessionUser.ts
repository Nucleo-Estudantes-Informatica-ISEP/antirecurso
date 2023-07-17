import User from 'src/types/User';
import swal from 'sweetalert';

const fetchSessionUser = async (token: string | undefined): Promise<User | null> => {
  if (!token) return null;

  const res = await fetch(`/api/auth/session`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store'
  });

  if (res.status === 200) return (await res.json()) as User;

  if (res.status === 401) {
    await fetch(`/api/auth/logout`, { method: 'PATCH' });
    await swal('Sessão expirada', 'Por favor, inicia sessão novamente.', 'error');
  }

  return null;
};

export default fetchSessionUser;
