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

export enum TransactionCategoryType {
  Income = 'I',
  Expense = 'E',
  Other = 'O',
}

export interface TransactionCategory {
  id: string;
  name: string;
  type: TransactionCategoryType;
  icon: string;
  notes?: string;
}
