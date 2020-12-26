import React, { useEffect, useState } from 'react';

import Modal from 'react-modal';
import { useRecoilState } from 'recoil';
import { Switch, Route, Redirect } from 'react-router-dom';

import Finances from './views/Finances';
import Footer from './components/Footer';
import Header from './components/Header';
import Spinner from './components/Spinner';
import { auth } from './services/firebase';
import { ROUTES } from './constants/routes';
import Authenticate from './views/Authenticate';
import { deserializeUser } from './services/auth';
import Notifications from './views/Notifications';
import currentUserAtom from './atoms/current-user';
import FinanceWallets from './views/FinanceWallets';
import useNotifications from './hooks/use-notifications';
import FinancesCategories from './views/FinancesCategories';

Modal.setAppElement('#root');

function App(): JSX.Element {
  const [currentUser, setCurrentUser] = useRecoilState(currentUserAtom);

  const [loading,  setLoading] = useState(true);

  useNotifications();

  useEffect(() => {
    if (!setCurrentUser) {
      return;
    }

    auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(deserializeUser(user));
      }
      setLoading(false);
    });
  }, [setCurrentUser]);

  if (loading) {
    return (
      <div className="container">
        <Spinner />
      </div>
    );
  }

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
        {/* <Route path="/finances/budgets" component={Budgets} /> */}
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
