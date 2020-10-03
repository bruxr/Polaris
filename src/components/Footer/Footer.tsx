import React from 'react';

import { useLocation } from 'react-router-dom';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import CalendarViewDay from '@material-ui/icons/CalendarViewDay';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';

import MenuItem from './MenuItem';

export default function Footer(): React.ReactElement {
  const location = useLocation();
  console.log(location);

  return (
    <nav
      className="fixed bg-gray-700 bottom-0 left-0 flex justify-between
        items-center w-screen h-5 px-4 py-8"
    >
      <MenuItem to="/finances">
        <CalendarViewDay />
      </MenuItem>
      <MenuItem to="/finances/wallets">
        <AccountBalanceWalletIcon />
      </MenuItem>
      <MenuItem to="/finances/categories">
        <LocalOfferIcon />
      </MenuItem>
      <MenuItem to="/finances/budgets">
        <ShowChartIcon />
      </MenuItem>
    </nav>
  );
}
