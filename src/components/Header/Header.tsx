import React, { useMemo } from 'react';

import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { useAuth0 } from '@auth0/auth0-react';
import NotificationsOutlinedIcon from '@material-ui/icons/NotificationsOutlined';

import notifsAtom from '../../atoms/notifications';

export default function Header(): JSX.Element {
  const { user, logout } = useAuth0();
  const notifications = useRecoilValue(notifsAtom);

  const hasUnreadNotifs = useMemo(() => notifications.filter((notif) => notif.unread).length > 0, [notifications]);

  return (
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
      <Link to="/notifications" className="relative">
        <NotificationsOutlinedIcon />
        {hasUnreadNotifs &&
          <span
            role="presentation"
            className="bg-red-600 absolute w-2 h-2 right-0 bottom-0 border border-white rounded-full"
          />
        }
      </Link>
    </header>
  );
}
