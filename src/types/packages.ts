export enum Courier {
  Jinio = 'jinio',
  Lazada = 'lazada',
  LBC = 'lbc',
}

export interface PackageStub {
  id: string;
  courier: Courier;
  code: string;
  eta: Date;
  lastStatus: string;
}

export interface Package {
  id: string;
  courier: Courier;
  code: string;
  eta: Date;
  received: boolean;
  lastStatus: string;
  lastTimestamp: Date;
  createdAt: Date;
}
