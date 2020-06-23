import { DateTime } from 'luxon';

export interface Notification {
  id: string;
  variant: string;
  title: string;
  body: string;
  unread: boolean;
  createdAt: DateTime;
}

export interface NotificationsCountQuery {
  notificationsCount: {
    __typename: 'NotificationsCount',
    unread: number;
  }
}
