import React, { useCallback, useState } from 'react';

import { useRecoilState } from 'recoil';
import { NavLink } from 'react-router-dom';
import AddBoxIcon from '@material-ui/icons/AddBox';
import InboxIcon from '@material-ui/icons/InboxOutlined';
import SettingsIcon from '@material-ui/icons/SettingsOutlined';
import LocalShippingIcon from '@material-ui/icons/LocalShippingOutlined';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWalletOutlined';

import addButtonAtom from '../../atoms/add-button';

export default function Footer(): JSX.Element {
  const [addShown, setAddShown] = useState(false);
  const [addBtnCallback] = useRecoilState(addButtonAtom);

  const handleAddBtnClick = useCallback(() => {
    if (addShown) {
      if (addBtnCallback) {
        addBtnCallback.onHide();
        return;
      }
      setAddShown(false);
    } else {
      if (addBtnCallback) {
        addBtnCallback.onShow();
        return;
      }
      setAddShown(true);
    }
  }, [addShown, addBtnCallback]);

  return (
    <nav className="flex justify-between fixed left-0 bottom-0 w-screen p-4 border-t">
      <NavLink to="/" activeClassName="text-blue-600" exact><InboxIcon /></NavLink>
      <NavLink to="/packages" activeClassName="text-blue-600"><LocalShippingIcon /></NavLink>
      <button
        type="button"
        onClick={handleAddBtnClick}
      >
        <AddBoxIcon />
      </button>
      <AccountBalanceWalletIcon />
      <NavLink to="/settings" activeClassName="text-blue-600"><SettingsIcon /></NavLink>
    </nav>
  );
}
