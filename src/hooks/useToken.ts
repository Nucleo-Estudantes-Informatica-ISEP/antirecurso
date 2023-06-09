import { BASE_URL } from 'src/services/api';

export const useToken = async () => {
  const setToken = (token: string) => {
    localStorage.setItem('@AntiRecurso:token', token);
  };

  const token = localStorage.getItem('@AntiRecurso:token');

  const res = await fetch(BASE_URL + '/user', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  if (res.status !== 200) localStorage.removeItem('@AntiRecurso:token');

  return { setToken, token };
};
