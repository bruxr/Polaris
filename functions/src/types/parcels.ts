export enum Courier {
  Jinio = 'jinio',
  Lazada = 'lazada',
}

export interface ParcelLog {
  desc: string;
  ts: Date;
}

export interface Parcel {
  code: string;
  courier: Courier,
  delivered: boolean;
  eta: Date;
  logs: ParcelLog[];
}
