import React from 'react';

import { NavLink } from 'react-router-dom';
import InboxIcon from '@material-ui/icons/InboxOutlined';
import LocalShippingIcon from '@material-ui/icons/LocalShippingOutlined';
import SettingsIcon from '@material-ui/icons/SettingsOutlined';

export default function Footer(): JSX.Element {
  return (
    <nav className="flex justify-between fixed left-0 bottom-0 w-screen p-4 border-t">
      <NavLink to="/" activeClassName="text-blue-600" exact><InboxIcon /></NavLink>
      <NavLink to="/packages" activeClassName="text-blue-600"><LocalShippingIcon /></NavLink>
      <NavLink to="/settings" activeClassName="text-blue-600"><SettingsIcon /></NavLink>
    </nav>
  );
}
