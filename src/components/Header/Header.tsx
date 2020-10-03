import React from 'react';

import { useRecoilValue } from 'recoil';
// import { useAuth0 } from '@auth0/auth0-react';
import MenuIcon from '@material-ui/icons/Menu';
import AddCircle from '@material-ui/icons/AddCircleOutline';

import addButtonAtom from '../../atoms/add-button';
// import notifsAtom from '../../atoms/notifications';

export default function Header(): JSX.Element {
  const add = useRecoilValue(addButtonAtom);

  // const { user, logout } = useAuth0();
  // const notifications = useRecoilValue(notifsAtom);

  // const hasUnreadNotifs = useMemo(() => notifications.filter((notif) => notif.unread).length > 0, [notifications]);

  return (
    <header
      className="fixed bg-white top-0 left-0 flex justify-between
        items-center w-screen h-16 p-5"
    >
      <button
        type="button"
        className="block w-6 h-6"
      >
        <MenuIcon />
      </button>
      <h1 className="font-bold text-xl">Polaris</h1>
      {add.onClick && (
        <button
          type="button"
          onClick={() => {
            if (add.onClick) {
              add.onClick();
            }
          }}
        >
          <AddCircle />
        </button>
      )}
    </header>
  );
}
