import { DateTime } from 'luxon';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { useAuth0 } from '@auth0/auth0-react';

import { db } from '../services/firebase';
import notifsAtom from '../atoms/notifications';
import { Notification } from '../types/notifications';

const useNotifications = (): void => {
  const { isAuthenticated } = useAuth0();
  const setNotifications = useSetRecoilState(notifsAtom);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    db.collection('notifications')
      .orderBy('ts', 'desc')
      .limit(10)
      .get()
      .then((snapshot) => {
        const notifs: Notification[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          notifs.push({
            id: doc.id,
            type: data.type,
            url: data.url,
            title: data.title,
            body: data.body,
            unread: data.read ? false : true,
            timestamp: DateTime.fromSeconds(data.ts.seconds),
          });
        });
        setNotifications(notifs);
      });
  }, [isAuthenticated, setNotifications]);
};

export default useNotifications;
