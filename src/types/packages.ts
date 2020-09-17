import { DateTime } from 'luxon';

export enum Courier {
  Jinio = 'jinio',
  Lazada = 'lazada',
  LBC = 'lbc',
}

export interface PackageStub {
  id: string;
  courier: Courier;
  code: string;
  eta: DateTime;
  lastStatus: string;
}

export interface Package {
  id: string;
  courier: Courier;
  code: string;
  eta: DateTime;
  received: boolean;
  lastStatus: string;
  lastTimestamp: DateTime;
  createdAt: DateTime;
}