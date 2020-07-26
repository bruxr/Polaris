import React from 'react';

import { useAuth0 } from '@auth0/auth0-react';

export default function Signin(): JSX.Element {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="flex min-w-full min-h-screen justify-center items-center">
      <button
        className="bg-blue-500 text-white rounded py-2 px-6"
        onClick={() => { loginWithRedirect(); }}
      >
        Sign In
      </button>
    </div>
  );
}
