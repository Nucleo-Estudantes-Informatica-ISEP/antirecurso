export const useToken = () => {
  const setToken = (token: string) => {
    localStorage.setItem('@AntiRecurso:token', token);
  };

  const token = localStorage.getItem('@AntiRecurso:token');

  return { setToken, token };
};
