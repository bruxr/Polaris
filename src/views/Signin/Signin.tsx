import React from 'react';

import Button from '../../components/Button';
import { useAuth0 } from '@auth0/auth0-react';

export default function Signin(): JSX.Element {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  return (
    <div className="flex flex-col min-w-full min-h-screen justify-center items-center p-5">
      {isAuthenticated
        ? (
          <Button onClick={() => { logout(); }}>
            Sign Out
          </Button>
        ) : (
          <Button onClick={() => { loginWithRedirect(); }}>
            Sign In
          </Button>
        )}
    </div>
  );
}
