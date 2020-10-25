import React from 'react';

import classnames from 'classnames';
import { Link } from 'react-router-dom';
import BuildOutlinedIcon from '@material-ui/icons/BuildOutlined';

import { Notification } from '../../types/notifications';

interface Props {
  notification: Notification;
}

export default function NotificationItem({ notification }: Props): JSX.Element {
  const Icon = BuildOutlinedIcon;

  const wrapperClasses = classnames(
    'block py-4 relative pl-8',
    { 'opacity-50': !notification.unread },
  );
  const children = (
    <>
      <Icon className="absolute left-0 top-4" />
      <h3 className="font-medium text-lg">{notification.title}</h3>
      {notification.body}
      <time className="block text-sm text-gray-500">{notification.timestamp.toRelative()}</time>
    </>
  );


  if (notification.url) {
    return (
      <Link to={notification.url} className={wrapperClasses}>
        {children}
      </Link>
    );
  } else {
    return (
      <div className={wrapperClasses}>
        {children}
      </div>
    );
  }
}
