import React from 'react';
import { useLocation } from 'react-router-dom';

import ClearAllIcon from '@material-ui/icons/ClearAllSharp';
import ShowChartIcon from '@material-ui/icons/ShowChartSharp';
import LocalOfferIcon from '@material-ui/icons/LocalOfferSharp';
import AccountBalanceIcon from '@material-ui/icons/AccountBalanceSharp';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWalletSharp';

import MenuItem from './MenuItem';
import { ROUTES } from '../../constants/routes';

export default function Footer(): React.ReactElement {
  const location = useLocation();
  const module = location.pathname.substr(1).split('/')[0];

  return (
    <nav
      className="fixed bg-black bottom-0 left-0 border-gray-900 border-t flex justify-between
        items-center w-screen h-5 px-4 py-8"
    >
      {module === 'finances' && (
        <>
          <MenuItem to={ROUTES.FINANCES}>
            <AccountBalanceWalletIcon />
          </MenuItem>
          <MenuItem to={ROUTES.FINANCES_BUDGETS}>
            <ShowChartIcon />
          </MenuItem>
          <MenuItem to={ROUTES.FINANCES_REPORTS}>
            <ClearAllIcon />
          </MenuItem>
          <MenuItem to={ROUTES.FINANCES_CATEGORIES}>
            <LocalOfferIcon />
          </MenuItem>
          <MenuItem to={ROUTES.FINANCES_WALLETS}>
            <AccountBalanceIcon />
          </MenuItem>
        </>
      )}
    </nav>
  );
}
