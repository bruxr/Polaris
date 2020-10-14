import React, { useEffect } from 'react';

import { useRecoilState } from 'recoil';
import { Switch, Route, Redirect } from 'react-router-dom';

import Budgets from './views/Budgets';
import Finances from './views/Finances';
import Footer from './components/Footer';
import Header from './components/Header';
import { auth } from './services/firebase';
import Authenticate from './views/Authenticate';
import Notifications from './views/Notifications';
import currentUserAtom from './atoms/current-user';
import useNotifications from './hooks/use-notifications';
import FinancesCategories from './views/FinancesCategories';

function App(): JSX.Element {
  const [currentUser, setCurrentUser] = useRecoilState(currentUserAtom);

  useNotifications();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        if (!user.email) {
          throw new Error('Cannot signin user without email address.');
        }

        setCurrentUser({
          id: user.uid,
          email: user.email,
        });
      } else {
        setCurrentUser(undefined);
      }
    });
  }, [setCurrentUser]);

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
