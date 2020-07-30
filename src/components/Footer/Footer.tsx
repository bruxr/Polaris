import React from 'react';

import { useRecoilValue } from 'recoil';
import { NavLink } from 'react-router-dom';
import AddBoxIcon from '@material-ui/icons/AddBox';
import InboxOutlinedIcon from '@material-ui/icons/InboxOutlined';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import LocalShippingOutlinedIcon from '@material-ui/icons/LocalShippingOutlined';
import AccountBalanceOutlinedIcon from '@material-ui/icons/AccountBalanceOutlined';

import addBtnAtom from '../../atoms/add-button';

const Footer = (): React.ReactElement => {
  const addBtn = useRecoilValue(addBtnAtom);

  return (
    <nav
      className="fixed bottom-0 left-0 flex justify-between items-center w-screen h-12 p-2 border-t border-gray-300"
    >
      <NavLink to="/">
        <InboxOutlinedIcon />
      </NavLink>
      <NavLink to="/finances">
        <AccountBalanceOutlinedIcon />
      </NavLink>
      <button
        type="button"
        onClick={() => {
          if (addBtn.onClick) {
            addBtn.onClick();
          }
        }}
      >
        <AddBoxIcon />
      </button>
      <NavLink to="/">
        <LocalShippingOutlinedIcon />
      </NavLink>
      <NavLink to="/">
        <SettingsOutlinedIcon />
      </NavLink>
    </nav>
  );
};

export default Footer;
