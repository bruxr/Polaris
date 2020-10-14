import React, { useState } from 'react';

import SigninForm from './SigninForm';
import SignupForm from './SignupForm';

export default function Authenticate(): React.ReactElement {
  const [signingUp, setSigningUp] = useState(false);

  return (
    <div className="min-w-full min-h-screen p-5">
      {signingUp ? (
        <>
          <SignupForm />
          <button
            type="button"
            className="block w-full text-center mt-2 p-4"
            onClick={() => setSigningUp(false)}
          >
            Sign In
          </button>
        </>
      ) : (
        <>
          <SigninForm />
          <button
            type="button"
            className="block w-full text-center mt-2 p-4"
            onClick={() => setSigningUp(true)}
          >
            Sign Up
          </button>
        </>
      )}
    </div>
  );
}
