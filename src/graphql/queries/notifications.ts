import { gql } from '@apollo/client';

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
  variant: string;
  title: string;
  body: string;
  unread: boolean;
  createdAt: string;
}
