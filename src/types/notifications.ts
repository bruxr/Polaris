import { DateTime } from 'luxon';

export enum NotificationType {
  TEST = 'test',
}

export interface Notification {
  id: string;
  url: string;
  type: NotificationType;
  title: string;
  body: string;
  unread: boolean;
  timestamp: DateTime;
}
