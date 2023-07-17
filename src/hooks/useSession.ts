import { useContext } from 'react';

import AuthContext, { AuthContextData } from '@/contexts/AuthContext';

const useSession = (): AuthContextData => {
  const authContext = useContext(AuthContext);
  return authContext;
};

export default useSession;
