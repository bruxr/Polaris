import React, { useEffect, useState, PropsWithChildren } from 'react';

import Signin from '../../views/Signin';
import { User } from '../../types/users';
import AuthContext from '../../contexts/auth';
import { setAuthToken } from '../../services/apollo';
import { readCredentials } from '../../services/auth';

export default function AuthRoot({ children }: PropsWithChildren<Record<string, unknown>>): JSX.Element {
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    const savedUser = readCredentials();
    if (savedUser) {
      setAuthToken(savedUser.token);
      setUser(savedUser);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ setUser, user }}>
      {user ? children : <Signin />}
    </AuthContext.Provider>
  );
}
