import { createContext } from 'react';

import { User } from '../types/users';

interface AuthContext {
  setUser: (user: User) => void;
  user?: User;
}

export default createContext<AuthContext>({
  setUser: () => {
    // Do nothing
  },
});
