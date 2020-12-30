import React, { PropsWithChildren } from 'react';

import classnames from 'classnames';
import { NavLink, NavLinkProps, useLocation } from 'react-router-dom';

export default function MenuItem({ to, children }: PropsWithChildren<NavLinkProps>): React.ReactElement {
  const location = useLocation();

  return (
    <NavLink
      to={to}
      className={classnames({
        'text-primary': to === location.pathname,
        'text-gray-500': to !== location.pathname,
      })}
    >
      {children}
    </NavLink>
  );
}
