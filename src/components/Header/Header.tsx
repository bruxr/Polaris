import React, { useState } from 'react';

import Modal from 'react-modal';
import { useRecoilValue } from 'recoil';
import { NavLink } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import AddSharpIcon from '@material-ui/icons/AddSharp';
import CloseSharpIcon from '@material-ui/icons/CloseSharp';
import SettingsIcon from '@material-ui/icons/SettingsSharp';
import ExitToAppSharpIcon from '@material-ui/icons/ExitToAppSharp';
import AccountbalanceIcon from '@material-ui/icons/AccountBalanceSharp';

import titleAtom from '../../atoms/title';
import { ROUTES } from '../../constants/routes';
import addButtonAtom from '../../atoms/add-button';

export default function Header(): JSX.Element {
  const title = useRecoilValue(titleAtom);
  const add = useRecoilValue(addButtonAtom);

  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 flex items-center w-screen h-16 p-4 bg-black">
        <button
          type="button"
          className="block w-6 h-6"
          onClick={() => setShowMenu(true)}
        >
          <MenuIcon />
        </button>
        <h1 className="font-bold text-xl ml-4">{title || 'Polaris'}</h1>
        {add.onClick && (
          <button
            type="button"
            className="block w-6 h-6 ml-auto text-primary"
            onClick={() => {
              if (add.onClick) {
                add.onClick();
              }
            }}
          >
            <AddSharpIcon />
          </button>
        )}
      </header>

      {/* Sidebar */}
      <Modal
        isOpen={showMenu}
        onRequestClose={() => setShowMenu(false)}
        className="fixed left-0 w-3/4 h-screen bg-black p-4"
        overlayClassName="fixed inset-0 w-full h-screen bg-gray-700 bg-opacity-75 z-50"
      >
        <button
          type="button"
          className="block w-6 h-6 mb-6"
          onClick={() => setShowMenu(false)}
        >
          <CloseSharpIcon />
        </button>

        <h2 className="font-bold text-2xl mb-10">Menu</h2>
        <nav>
          <ul className="flex flex-col space-y-3 -ml-4 -mr-4 text-gray-500">
            <li>
              <NavLink
                className="block p-4 hover:text-gray-300"
                activeClassName="bg-gray-900 text-primary"
                to={ROUTES.FINANCES}
                onClick={() => setShowMenu(false)}
              >
                <AccountbalanceIcon className="mr-2 align-bottom" />
                Finances
              </NavLink>
            </li>
            <li>
              <NavLink
                className="block p-4 hover:text-gray-300"
                activeClassName="bg-gray-900 text-primary"
                to={ROUTES.SETTINGS}
                onClick={() => setShowMenu(false)}
              >
                <SettingsIcon className="mr-2 align-bottom" />
                Settings
              </NavLink>
            </li>
            <li>
              <button type="button" className="flex items-center text-gray-500 hover:text-gray-300 p-4">
                <ExitToAppSharpIcon className="mr-2" />
                Sign-Out
              </button>
            </li>
          </ul>
        </nav>
      </Modal>
    </>
  );
}
