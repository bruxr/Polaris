import React from 'react';

import { useAuth0 } from '@auth0/auth0-react';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { Switch, Route, Link, NavLink } from 'react-router-dom';
import InboxOutlinedIcon from '@material-ui/icons/InboxOutlined';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import LocalShippingOutlinedIcon from '@material-ui/icons/LocalShippingOutlined';
import NotificationsOutlinedIcon from '@material-ui/icons/NotificationsOutlined';
import AccountBalanceOutlinedIcon from '@material-ui/icons/AccountBalanceOutlined';

import Signin from './views/Signin';
import Dashboard from './views/Dashboard';

function App(): JSX.Element {
  const { isAuthenticated, user, logout } = useAuth0();

  if (!isAuthenticated) {
    return (
      <div className="container">
        <Signin />
      </div>
    );
  }

  return (
    <div className="container min-h-screen pb-16 pt-20 px-2">
      <header
        className="fixed top-0 left-0 flex justify-between items-center w-screen h-16 p-2 border-b border-gray-300"
      >
        <button
          type="button"
          className="block w-8 h-8"
          onClick={() => logout()}
        >
          <img src={user.picture} alt={user.name} className="rounded-full" />
        </button>
        <h1 className="font-bold text-xl">Polaris</h1>
        <Link to="/notifications">
          <NotificationsOutlinedIcon />
        </Link>
      </header>
      <Switch>
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
