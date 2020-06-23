import React from 'react';

import { RecoilRoot } from 'recoil';
import { ApolloProvider } from '@apollo/client';
import { MemoryRouter as Router, Switch, Route }  from 'react-router-dom';

import apollo from './services/apollo';
import Dashboard from './views/Dashboard';
import Notifications from './views/Notifications';

function Views(): JSX.Element {
  return (
    <Switch>
      <Route path="/notifications" component={Notifications} />
      <Route path="/" component={Dashboard} exact />
    </Switch>
  );
}

function App(): JSX.Element {
  return (
    <RecoilRoot>
      <ApolloProvider client={apollo}>
        <Router>
          <div className="min-w-screen min-h-screen px-4">
            <Views />
          </div>
        </Router>
      </ApolloProvider>
    </RecoilRoot>
  );
}

export default App;
