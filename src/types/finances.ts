import { Document } from './db';

export interface TransactionMonthStats extends Document {
  expenses?: number;
  income?: number;
  other?: number;
  categories: Array<{
    category: Pick<TransactionCategory, '_id' | 'name'>,
    amount: number,
  }>;
}

export enum WalletType {
  Credit = 'CREDIT_CARD',
  Savings = 'SAVINGS',
}

export interface Wallet extends Document {
  name: string;
  type: WalletType;
  createdAt: Date;
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
  code?: 'ADJUSTMENT' | 'TRANSFER' | 'INITIAL';
}

export interface Transaction extends Document {
  wallet: Pick<Wallet, '_id' | 'name'>,
  category: Pick<TransactionCategory, '_id' | 'name'>
  previous?: string;
  amount: number;
  balance: number;
  date: Date;
  notes?: string;
  location?: [number, number];
  readonly createdAt: Date;
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
