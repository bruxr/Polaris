import React from 'react';

import { RecoilRoot } from 'recoil';
import { ApolloProvider } from '@apollo/client';
import { MemoryRouter as Router, Switch, Route }  from 'react-router-dom';

import apollo from './services/apollo';
import Dashboard from './views/Dashboard';
import AuthGuard from './components/AuthGuard';

function App(): JSX.Element {
  return (
    <RecoilRoot>
      <ApolloProvider client={apollo}>
        <Router>
          <div className="min-w-screen min-h-screen px-4">
            <AuthGuard>
              <Switch>
                <Route path="/" component={Dashboard} exact />
              </Switch>
            </AuthGuard>
          </div>
        </Router>
      </ApolloProvider>
    </RecoilRoot>
  );
}

export default App;
