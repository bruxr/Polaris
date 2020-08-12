import { DateTime } from 'luxon';
import { firestore } from 'firebase';

export interface MonthlyTransactionStats {
  month: string;
  expenses: number;
  income: number;
  categories: Record<string, number>;
}

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

export interface Transaction {
  id: string;
  wallet: string;
  category: string;
  amount: number;
  date: Date;
  notes?: string;
  location?: [number, number];
}

export interface TransactionRecord {
  id: string;
  wallet: firestore.DocumentReference;
  category: firestore.DocumentReference;
  date: Date;
  amount: number;
  notes?: string;
  location?: firestore.GeoPoint;
  ts: Date;
}
