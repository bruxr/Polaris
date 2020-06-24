import React, { useEffect, useMemo } from 'react';

import { loader } from 'graphql.macro';
import { useQuery, useMutation } from '@apollo/client';

import Spinner from '../../components/Spinner';
import NotificationItem from './NotificationItem';
import { deserializeNotification } from '../../deserializers/notifications';
import { Notification, NotificationsCountQuery } from '../../types/notifications';
import NOTIFICATIONS, { NotificationResult } from '../../graphql/queries/notifications';

const NOTIFICATIONS_COUNT = loader('../../graphql/queries/notifications-count.gql');
const MARK_NOTIFICATIONS_READ = loader('../../graphql/mutations/mark-notifications-read.gql');

export default function Notifications(): JSX.Element {
  const { loading, data } = useQuery(NOTIFICATIONS, { fetchPolicy: 'cache-and-network' });
  const [markNotificationsRead] = useMutation(
    MARK_NOTIFICATIONS_READ,
    {
      // Update notifs count to zero in cache
      update: (cache) => {
        const count = cache.readQuery<NotificationsCountQuery>({ query: NOTIFICATIONS_COUNT });
        if (count) {
          cache.writeQuery({
            query: NOTIFICATIONS_COUNT,
            data: {
              notificationsCount: {
                ...count.notificationsCount,
                unread: 0,
              },
            },
          });
        }
      },
    }
  );

  // Convert notifications to objects we can use
  const notifs = useMemo<Notification[] | undefined>(() => {
    if (!data) {
      return undefined;
    }

    return data.notifications.map((item: NotificationResult) => deserializeNotification(item));
  }, [data]);

  // Mark notifications read in backend
  useEffect(() =>  {
    if (data) {
      const ids = data.notifications.map((notif: Notification) => notif.id);
      markNotificationsRead({ variables: { ids } });
    }
  }, [data, markNotificationsRead]);

  if (loading) {
    return (
      <div className="w-full flex justify-center">
        <Spinner />
      </div>
    );
  }
  
  return (
    <div className="divide-y">
      {notifs && notifs.map((notification: Notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
}
