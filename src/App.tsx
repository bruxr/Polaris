import React from 'react';

import { RecoilRoot } from 'recoil';
import { ApolloProvider } from '@apollo/client';

import Signin from './views/Signin';
import apollo from './services/apollo';

function App(): JSX.Element {
  return (
    <RecoilRoot>
      <ApolloProvider client={apollo}>
        <div className="min-w-screen min-h-screen px-4">
          <Signin />
        </div>
      </ApolloProvider>
    </RecoilRoot>
  );
}

export default App;
