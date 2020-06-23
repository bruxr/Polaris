import React from 'react';

import { loader } from 'graphql.macro';
import { useQuery } from '@apollo/client';

import Spinner from '../../components/Spinner';
import NotificationItem from './NotificationItem';
import { Notification } from '../../types/notifications';

const NOTIFICATIONS = loader('../../graphql/queries/notifications.gql');

export default function Notifications(): JSX.Element {
  const { loading, data } = useQuery(NOTIFICATIONS, { fetchPolicy: 'no-cache' });

  if (loading) {
    return (
      <div className="w-full flex justify-center">
        <Spinner />
      </div>
    );
  }
  
  return (
    <div className="divide-y">
      {data && data.notifications.map((notification: Notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
}
