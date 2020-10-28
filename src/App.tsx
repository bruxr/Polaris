import React from 'react';

import { useRecoilValue } from 'recoil';
import { Switch, Route, Redirect } from 'react-router-dom';

import Budgets from './views/Budgets';
import Finances from './views/Finances';
import Footer from './components/Footer';
import Header from './components/Header';
import { ROUTES } from './constants/routes';
import Authenticate from './views/Authenticate';
import Notifications from './views/Notifications';
import currentUserAtom from './atoms/current-user';
import FinanceWallets from './views/FinanceWallets';
import useNotifications from './hooks/use-notifications';
import FinancesCategories from './views/FinancesCategories';

function App(): JSX.Element {
  const currentUser = useRecoilValue(currentUserAtom);

  useNotifications();

  if (!currentUser) {
    return (
      <div className="container">
        <Authenticate />
      </div>
    );
  }

  return (
    <div className="container min-h-screen pb-16 pt-20 px-2">
      <Header />
      <Switch>
        <Route path="/finances/budgets" component={Budgets} />
        <Route path="/finances/categories" component={FinancesCategories} />
        <Route path={ROUTES.FINANCE_WALLETS} component={FinanceWallets} />
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
