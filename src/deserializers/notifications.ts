import { DateTime } from 'luxon';

import { Notification } from '../types/notifications';
import { NotificationResult } from '../graphql/queries/notifications';

export function deserializeNotification(data: NotificationResult): Notification {
  return {
    ...data,
    createdAt: DateTime.fromISO(data.createdAt),
  };
}  
