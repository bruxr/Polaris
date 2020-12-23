import { firestore } from 'firebase';
import { FaunaRecord } from './common';

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

export interface Wallet extends FaunaRecord {
  name: string;
  balance: number;
  type: WalletType;
}

export enum TransactionCategoryType {
  Income = 'INCOME',
  Expense = 'EXPENSE',
  Other = 'OTHER',
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
