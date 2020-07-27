import React from 'react';

import { useAuth0 } from '@auth0/auth0-react';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { Switch, Route, NavLink } from 'react-router-dom';
import InboxOutlinedIcon from '@material-ui/icons/InboxOutlined';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import LocalShippingOutlinedIcon from '@material-ui/icons/LocalShippingOutlined';
import AccountBalanceOutlinedIcon from '@material-ui/icons/AccountBalanceOutlined';

import Signin from './views/Signin';
import Header from './components/Header';
import Dashboard from './views/Dashboard';
import Notifications from './views/Notifications';
import useNotifications from './hooks/use-notifications';

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
        <Route path="/notifications" component={Notifications} />
        <Route path="/" component={Dashboard} />
      </Switch>
      <nav
        className="fixed bottom-0 left-0 flex justify-between items-center w-screen h-12 p-2 border-t border-gray-300"
      >
        <NavLink to="/">
          <InboxOutlinedIcon />
        </NavLink>
        <NavLink to="/">
          <AccountBalanceOutlinedIcon />
        </NavLink>
        <button type="button">
          <AddBoxIcon />
        </button>
        <NavLink to="/">
          <LocalShippingOutlinedIcon />
        </NavLink>
        <NavLink to="/">
          <SettingsOutlinedIcon />
        </NavLink>
      </nav>
    </div>
  );
}

export default App;
