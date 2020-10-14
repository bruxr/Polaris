import React from 'react';

import SigninForm from './SigninForm';

export default function Authenticate(): React.ReactElement {
  return (
    <div className="min-w-full min-h-screen p-5">
      <SigninForm />
    </div>
  );
}
