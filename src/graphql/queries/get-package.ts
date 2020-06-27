import { gql } from '@apollo/client';

import { Courier } from '../../types/packages';

export default gql`
  query Package($id: String!) {
    packages(id: $id) {
      id
      courier
      trackingCode
      eta
      received
      lastStatus
      lastTimestamp
      createdAt
    }
  }
`;

export interface PackageResult {
  __typename: 'Package';
  id: string;
  courier: Courier;
  trackingCode: string;
  eta: string;
  received: boolean;
  lastStatus: string;
  lastTimestamp: string;
  createdAt: string;
}

export interface PackageQuery {
  packages: PackageResult[];
}
