import React from 'react';

import { loader } from 'graphql.macro';
import { useQuery } from '@apollo/client';
import MenuIcon from '@material-ui/icons/Menu';
import { Link, NavLink, useLocation } from 'react-router-dom';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIosOutlined';
import NotificationsOutlined from '@material-ui/icons/NotificationsOutlined';

const GET_NOTIFICATIONS_COUNT = loader('../../graphql/queries/notifications-count.gql');

export default function Header(): JSX.Element {
  const location = useLocation();

  const { data: notifsData } = useQuery(GET_NOTIFICATIONS_COUNT);

  return (
    <header className="fixed flex justify-between w-screen border-b p-4 py-4 left-0 top-0">
      {location.pathname === '/'
        ? <button type="button"><MenuIcon /></button>
        : <Link to="/"><ArrowBackIosIcon /></Link>}
      <h1 className="text-lg font-bold">Polaris</h1>
      <NavLink
        to="/notifications"
        className="block relative"
        activeClassName="text-blue-600"
      >
        <NotificationsOutlined />
        {notifsData && notifsData.notificationsCount.unread > 0 && (
          <div
            className="
              absolute bg-red-600 text-white text-xs font-bold rounded-full
              w-3 h-3 text-center border-white border right-0 bottom-0
            "
          />
        )}
      </NavLink>
    </header>
  );
}
