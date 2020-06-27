import { gql } from '@apollo/client';

import { Courier } from '../../types/packages';

export default gql`
  query Packages {
    packages {
      id
      courier
      trackingCode
      eta
      lastStatus
      lastTimestamp
      createdAt
    }
  }
`;

export interface PackageStubResult {
  __typename: 'Package';
  id: string;
  courier: Courier;
  trackingCode: string;
  eta: string;
  lastStatus: string;
  lastTimestamp: string;
  createdAt: string;
}

export interface PackagesQuery {
  packages: PackageStubResult[];
}
