import { DateTime } from 'luxon';
import { firestore } from 'firebase';
import mapValues from 'lodash-es/mapValues';

import { Deserializer } from '../types/common';
import { MonthlyTransactionStats, Wallet, TransactionCategory, Transaction } from '../types/finances';

export const deserializeWallet = (id: string, data: firestore.DocumentData): Wallet => {
  return {
    id,
    name: data.name,
    type: data.type,
    balance: data.balance / 100,
    ts: DateTime.fromSeconds(data.ts.seconds),
  };
};

export const deserializeTransactionCategory = (id: string, data: firestore.DocumentData): TransactionCategory => {
  return {
    id,
    name: data.name,
    type: data.type,
    icon: data.icon,
    notes: data.notes || undefined,
  };
};

export function deserializeTransaction(id: string, data: firestore.DocumentData): Transaction {
  return {
    id,
    wallet: data.wallet.id,
    category: data.category.id,
    amount: data.amount / 100,
    date: data.date,
    notes: data.notes,
    location: data.location ? [data.location.latitude, data.location.longitude] : undefined,
  };
}

export const deserializeStats: Deserializer<MonthlyTransactionStats> = function (id, data) {
  return {
    month: id,
    income: data.income,
    expenses: data.expenses,
    categories: mapValues(data.categories, amount => amount / 100),
  };
};
