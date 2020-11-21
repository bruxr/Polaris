import React from 'react';

import ShowChartIcon from '@material-ui/icons/ShowChart';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import CalendarViewDay from '@material-ui/icons/CalendarViewDay';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';

import MenuItem from './MenuItem';
import { ROUTES } from '../../constants/routes';

export default function Footer(): React.ReactElement {
  return (
    <nav
      className="fixed bg-gray-700 bottom-0 left-0 flex justify-between
        items-center w-screen h-5 px-4 py-8"
    >
      <MenuItem to="/finances">
        <CalendarViewDay />
      </MenuItem>
      <MenuItem to={ROUTES.FINANCE_WALLETS}>
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
