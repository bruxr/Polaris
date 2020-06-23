import React, { useMemo } from 'react';

import BuildIcon from '@material-ui/icons/BuildOutlined';
import LocalShippingIcon from '@material-ui/icons/LocalShippingOutlined';

import { Notification } from '../../types/notifications';

interface Props {
  notification: Notification;
}

export default function NotificationItem({ notification }: Props): JSX.Element {
  const Icon = useMemo(() => {
    switch (notification.variant) {
      case 'package':
        return LocalShippingIcon;
      default:
        return BuildIcon;
    }
  }, [notification]);

  return (
    <div className="flex p-4 bg-indigo-100">
      <Icon className="mr-4" />
      <div className="text-gray-600">
        <h3 className="font-medium text-blue-900">{notification.title}</h3>
          {notification.body}
          <div className="text-gray-500 text-sm mt-1">{notification.createdAt}</div>
      </div>
    </div>
  );
}
