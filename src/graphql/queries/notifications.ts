import { gql } from '@apollo/client';

import { NotificationVariant } from '../../types/notifications';

export default gql`
  query Notifications {
    notifications {
      id
      variant
      title
      body
      unread
      createdAt
    }
  }
`;

export interface NotificationResult {
  __typename: 'Notification';
  id: string;
  variant: NotificationVariant;
  title: string;
  body: string;
  unread: boolean;
  createdAt: string;
}
