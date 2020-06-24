import React from 'react';

import { ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Switch, Route }  from 'react-router-dom';

import Dashboard from './views/Dashboard';
import AuthRoot from './components/AuthRoot';
import AppShell from './components/AppShell';
import apolloClient from './services/apollo';
import Notifications from './views/Notifications';

function Views(): JSX.Element {
  return (
    <AppShell>
      <Switch>
        <Route path="/notifications" component={Notifications} />
        <Route path="/" component={Dashboard} exact />
      </Switch>
    </AppShell>
  );
}

function App(): JSX.Element {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthRoot>
        <Router>
          <Views />
        </Router>
      </AuthRoot>
    </ApolloProvider>
  );
}

export default App;
