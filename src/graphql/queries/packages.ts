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
}

export interface PackagesQuery {
  packages: PackageStubResult[];
}
