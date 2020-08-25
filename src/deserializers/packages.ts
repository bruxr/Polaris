import { DateTime } from 'luxon';
import omit from 'lodash-es/omit';

import { PackageStub, Package } from '../types/packages';
import { PackageResult } from '../graphql/queries/get-package';
import { PackageStubResult } from '../graphql/queries/packages';

export function deserializePackageStub(pkg: PackageStubResult): PackageStub {
  return omit({
    ...pkg,
    code: pkg.trackingCode,
    eta: DateTime.fromISO(pkg.eta),
  }, 'trackingCode');
}

export function deserializePackage(pkg: PackageResult): Package {
  return omit({
    ...pkg,
    code: pkg.trackingCode,
    eta: DateTime.fromISO(pkg.eta),
    lastTimestamp: DateTime.fromISO(pkg.lastTimestamp),
    createdAt: DateTime.fromISO(pkg.createdAt),
  }, 'trackingCode');
}
