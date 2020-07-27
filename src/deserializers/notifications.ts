import { DateTime } from 'luxon';
import { firestore } from 'firebase';

import { Notification } from '../types/notifications';

export const deserializeNotif = (id: string, data: firestore.DocumentData): Notification => ({
  id,
  type: data.type,
  url: data.url,
  title: data.title,
  body: data.body,
  unread: data.read ? false : true,
  timestamp: DateTime.fromSeconds(data.ts.seconds),
});
