import { firestore } from 'firebase';

import { Document } from './db';

export interface MonthlyTransactionStats {
  month: string;
  expenses: number;
  income: number;
  categories: Record<string, number>;
}

export enum WalletType {
  Credit = 'CREDIT_CARD',
  Savings = 'SAVINGS',
}

export interface Wallet extends Document {
  name: string;
  balance: number;
  type: WalletType;
  createdOn: Date;
}

export enum TransactionCategoryType {
  Income = 'INCOME',
  Expense = 'EXPENSE',
  Other = 'OTHER',
}

export interface TransactionCategory extends Document {
  name: string;
  type: TransactionCategoryType;
  notes?: string;
  code?: 'ADJUSTMENT' | 'TRANSFER';
}

export interface Transaction extends Document {
  walletId: string;
  categoryId: string;
  amount: number;
  date: Date;
  notes?: string;
  location?: [number, number];
  readonly timestamp: Date;
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

export interface MonthlyBudget {
  id: string;
  month: Date;
  amounts: Budget[];
}

export interface Budget {
  category: string;
  budget: number;
  spent: number;
}
