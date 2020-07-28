import React, { PropsWithChildren, useEffect } from 'react';

import { messaging } from '../../services/firebase';
import { setupMessaging } from '../../services/messaging';

export default function NotificationsManager({ children }: PropsWithChildren<unknown>): JSX.Element {
  useEffect(() => {
    setupMessaging();

    messaging.onMessage((payload) => {
      console.log(payload);
    }, (err) => {
      console.error(err);
    });
  }, []);

  return (
    <>
      {children}
    </>
  );
}
