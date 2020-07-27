import React, { useEffect } from 'react';

import { useRecoilValue } from 'recoil';

import { db } from '../../services/firebase';
import NotificationItem from './NotificationItem';
import notifsAtom from '../../atoms/notifications';

export default function Notifications(): JSX.Element {
  const notifications = useRecoilValue(notifsAtom);

  useEffect(() => {
    return () => {
      const batch = db.batch();
      notifications
        .filter((notif) => notif.unread)
        .forEach((notif) => {
          batch.update(db.collection('notifications').doc(notif.id), { read: true });
        });
      batch.commit();
    };
  }, [notifications]);

  return (
    <div className="divide-y">
      {notifications.map((notif) => <NotificationItem key={notif.id} notification={notif} />)}
    </div>
  );
}
