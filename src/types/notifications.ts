import { DateTime } from 'luxon';

export enum NotificationVariant {
  Test = 'test',
  Package = 'package',
}

export interface Notification {
  id: string;
  variant: NotificationVariant;
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
