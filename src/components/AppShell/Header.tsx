import React from 'react';

import MenuIcon from '@material-ui/icons/Menu';
import NotificationsOutlined from '@material-ui/icons/NotificationsOutlined';

export default function Header(): JSX.Element {
  return (
    <header className="fixed flex justify-between w-screen border-b p-4 py-4 left-0 top-0">
      <button type="button">
        <MenuIcon />
      </button>
      <h1 className="text-lg font-bold">Polaris</h1>
      <button type="button">
        <NotificationsOutlined />
      </button>
    </header>
  );
}
