import React, { useMemo } from 'react';

import classnames from 'classnames';
import BuildIcon from '@material-ui/icons/BuildOutlined';
import LocalShippingIcon from '@material-ui/icons/LocalShippingOutlined';

import { Notification, NotificationVariant } from '../../types/notifications';

interface Props {
  notification: Notification;
}

export default function NotificationItem({ notification }: Props): JSX.Element {
  const Icon = useMemo(() => {
    switch (notification.variant) {
      case NotificationVariant.Package:
        return LocalShippingIcon;
      default:
        return BuildIcon;
    }
  }, [notification]);

  return (
    <div className={classnames('flex p-4', { 'bg-indigo-100': notification.unread })}>
      <Icon className="mr-4" />
      <div className="text-gray-600">
        <h3 className="font-medium text-blue-900">{notification.title}</h3>
          {notification.body}
          <div className="text-gray-500 text-sm mt-1">{notification.createdAt.toRelative()}</div>
      </div>
    </div>
  );
}
