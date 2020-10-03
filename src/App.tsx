import React from 'react';

import { useAuth0 } from '@auth0/auth0-react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Signin from './views/Signin';
import Budgets from './views/Budgets';
import Finances from './views/Finances';
import Footer from './components/Footer';
import Header from './components/Header';
import Notifications from './views/Notifications';
import useNotifications from './hooks/use-notifications';
import FinancesCategories from './views/FinancesCategories';

function App(): JSX.Element {
  const { isAuthenticated } = useAuth0();

  useNotifications();

  if (!isAuthenticated) {
    return (
      <div className="container">
        <Signin />
      </div>
    );
  }

  return (
    <div className="container min-h-screen pb-16 pt-20 px-2">
      <Header />
      <Switch>
        <Route path="/finances/budgets" component={Budgets} />
        <Route path="/finances/categories" component={FinancesCategories} />
        <Route path="/finances" component={Finances} />
        <Route path="/notifications" component={Notifications} />
        {/* <Route path="/" component={Dashboard} /> */}
        <Redirect to="/finances" />
      </Switch>
      <Footer />
    </div>
  );
}

export default App;
