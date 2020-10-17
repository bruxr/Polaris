import { useEffect } from 'react';
import sortBy from 'lodash-es/sortBy';
import reverse from 'lodash-es/reverse';
import { useSetRecoilState } from 'recoil';

import { db } from '../services/firebase';
import notifsAtom from '../atoms/notifications';
import { deserializeNotif } from '../deserializers/notifications';

const useNotifications = (): void => {
  const setNotifications = useSetRecoilState(notifsAtom);

  useEffect(() => {
    db.collection('notifications')
      .orderBy('ts', 'desc')
      .limit(10)
      .onSnapshot((snapshot) => {
        setNotifications((notifs) => {
          let copy = notifs.slice(0);

          // Append new notifications or update existing ones
          snapshot.forEach((doc) => {
            const index = copy.findIndex((notif) => notif.id === doc.id);
            const notif = deserializeNotif(doc.id, doc.data());
            if (index >= 0) {
              copy[index] = notif;
            } else {
              copy.push(notif);
            }
          });

          // Sort by reverse-chronological order
          copy = reverse(sortBy(copy, 'timestamp'));

          return copy;
        });
      });
  }, [setNotifications]);
};

export default useNotifications;
