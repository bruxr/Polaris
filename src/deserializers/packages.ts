import { DateTime } from 'luxon';
import omit from 'lodash-es/omit';

import { PackageStub } from '../types/packages';
import { PackageStubResult } from '../graphql/queries/packages';

export function deserializePackageStub(pkg: PackageStubResult): PackageStub {
  return omit({
    ...pkg,
    code: pkg.trackingCode,
    eta: DateTime.fromISO(pkg.eta),
    lastTimestamp: DateTime.fromISO(pkg.lastTimestamp),
    createdAt: DateTime.fromISO(pkg.createdAt),
  }, 'trackingCode');
}
