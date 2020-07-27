import { DateTime } from 'luxon';

export interface PackageTrackingInfo {
  eta: DateTime;
  delivered: boolean;
  logs: Array<{
    timestamp: DateTime;
    description: string;
  }>,
}
