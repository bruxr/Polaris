import React from 'react';

import { Auth0Provider } from '@auth0/auth0-react';

import Signin from './views/Signin';

function App(): JSX.Element {
  console.log(process.env);

  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN || ''}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID || ''}
      redirectUri={window.location.origin}
    >
      <div className="container">
        <Signin />
      </div>
    </Auth0Provider>
  );
}

export default App;
