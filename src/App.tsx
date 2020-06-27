import React from 'react';

import { RecoilRoot } from 'recoil';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Switch, Route }  from 'react-router-dom';

import Package from './views/PackageView';
import Packages from './views/Packages';
import Dashboard from './views/Dashboard';
import AuthRoot from './components/AuthRoot';
import AppShell from './components/AppShell';
import apolloClient from './services/apollo';
import Notifications from './views/Notifications';

function Views(): JSX.Element {
  return (
    <AppShell>
      <Switch>
        <Route path="/packages" component={Packages} />
        <Route path="/notifications" component={Notifications} />
      </Switch>

      <Route path={["/packages/:id", "/notifications/packages/:id"]} component={Package} />
      <Route path="/" component={Dashboard} exact />
    </AppShell>
  );
}

function App(): JSX.Element {
  return (
    <RecoilRoot>
      <ApolloProvider client={apolloClient}>
        <AuthRoot>
          <Router>
            <Views />
          </Router>
        </AuthRoot>
      </ApolloProvider>
    </RecoilRoot>
  );
}

export default App;
