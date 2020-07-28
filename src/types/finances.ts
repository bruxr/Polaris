import { DateTime } from 'luxon';

export enum WalletType {
  Credit = 'C',
  Savings = 'S',
}

export interface Wallet {
  id: string;
  name: string;
  type: WalletType;
  balance: number;
  ts: DateTime;
}
