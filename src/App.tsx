import React, { useEffect, useState } from 'react';

import Modal from 'react-modal';
import { DateTime } from 'luxon';
import { useRecoilState } from 'recoil';
import { Switch, Route, Redirect } from 'react-router-dom';

import Finances from './views/Finances';
import Settings from './views/Settings';
import { setupDb } from './services/db';
import Footer from './components/Footer';
import Header from './components/Header';
import Spinner from './components/Spinner';
import { ROUTES } from './constants/routes';
import Authenticate from './views/Authenticate';
import currentUserAtom from './atoms/current-user';
import FinancesWallets from './views/FinancesWallets';
import auth, { deserializeUser } from './services/auth';
import FinancesCategories from './views/FinancesCategories';

Modal.setAppElement('#root');

function App(): JSX.Element {
  const [currentUser, setCurrentUser] = useRecoilState(currentUserAtom);

  const [loading,  setLoading] = useState(0);

  useEffect(() => {
    const user = auth.currentUser();
    if (user) {
      const expiry = DateTime.fromMillis(user.token.expires_at);
      if (!expiry.isValid || expiry <= DateTime.local()) {
        user.jwt(true)
          .then(() => {
            setCurrentUser(deserializeUser(user));
            setLoading((prev) => prev + 1);
          })
          .catch(() => {
            setLoading((prev) => prev + 1);
          });
      } else {
        setCurrentUser(deserializeUser(user));
        setLoading((prev) => prev + 1);
      }
    } else {
      setLoading((prev) => prev + 1);
    }
  }, [setCurrentUser]);
  useEffect(() => {
    setupDb().then(() => {
      setLoading((prev) => prev + 1);
    });
  }, []);

  if (loading < 2) {
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
    <div className="container min-h-screen pb-16 pt-20 px-4">
      <Header />
      <Switch>
        {/* <Route path="/finances/budgets" component={Budgets} /> */}
        <Route path={ROUTES.FINANCES_CATEGORIES} component={FinancesCategories} />
        <Route path={ROUTES.FINANCES_WALLETS} component={FinancesWallets} />
        <Route path="/finances" component={Finances} />
        {/* <Route path="/" component={Dashboard} /> */}
        <Route path={ROUTES.SETTINGS} component={Settings} />
        <Redirect to="/finances" />
      </Switch>
      <Footer />
    </div>
  );
}

export default App;
