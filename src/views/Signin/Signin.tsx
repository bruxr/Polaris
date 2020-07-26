import React from 'react';

import { useAuth0 } from '@auth0/auth0-react';

export default function Signin(): JSX.Element {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  return (
    <div className="flex flex-col min-w-full min-h-screen justify-center items-center">
      {isAuthenticated
        ? (
          <button
            className="block py-2 px-6"
            onClick={() => { logout(); }}
          >
            Sign Out
          </button>
        ) : (
          <button
            className="block bg-blue-500 text-white rounded py-2 px-6 mb-4"
            onClick={() => { loginWithRedirect(); }}
          >
            Sign In
          </button>
        )}
    </div>
  );
}
