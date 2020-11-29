import React, { useEffect, useState } from 'react';

import { DateTime } from 'luxon';
import { useRecoilState } from 'recoil';
import { Switch, Route, Redirect } from 'react-router-dom';

import Footer from './components/Footer';
import Header from './components/Header';
import Spinner from './components/Spinner';
import { ROUTES } from './constants/routes';
import Authenticate from './views/Authenticate';
import Notifications from './views/Notifications';
import currentUserAtom from './atoms/current-user';
import FinanceWallets from './views/FinanceWallets';
import auth, { deserializeUser } from './services/auth';
import useNotifications from './hooks/use-notifications';
import FinancesCategories from './views/FinancesCategories';

function App(): JSX.Element {
  const [currentUser, setCurrentUser] = useRecoilState(currentUserAtom);

  const [loading,  setLoading] = useState(true);

  useNotifications();

  useEffect(() => {
    const user = auth.currentUser();
    if (user) {
      const expiry = DateTime.fromMillis(user.token.expires_at);
      if (!expiry.isValid || expiry <= DateTime.local()) {
        user.jwt(true)
          .then(() => {
            setCurrentUser(deserializeUser(user));
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
      } else {
        setCurrentUser(deserializeUser(user));
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
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
        {/* <Route path="/finances" component={Finances} /> */}
        <Route path="/notifications" component={Notifications} />
        {/* <Route path="/" component={Dashboard} /> */}
        <Redirect to="/finances" />
      </Switch>
      <Footer />
    </div>
  );
}

export default App;
