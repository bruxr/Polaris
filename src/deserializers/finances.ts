/* eslint @typescript-eslint/no-explicit-any: 0, @typescript-eslint/explicit-module-boundary-types: 0 */

import { firestore } from 'firebase';
import mapValues from 'lodash-es/mapValues';

import { Deserializer } from '../types/common';
import { MonthlyTransactionStats, Transaction, MonthlyBudget, TransactionCategory } from '../types/finances';

type BudgetItem = {
  category: firebase.firestore.DocumentReference,
  budget: number,
  spent: number,
}

function deserializeTransactionCategory(input: any): TransactionCategory {
  return {
    _id: input.id,
    _rev: '',
    kind: '',
    name: input.name,
    type: input.type,
    notes: input.notes,
  };
}

export function deserializeTransaction(id: string, data: firestore.DocumentData): Transaction {
  return {
    _id: id,
    _rev: '',
    kind: '',
    walletId: data.wallet.id,
    categoryId: data.category.id,
    amount: data.amount / 100,
    date: new Date(data.date.seconds * 1000),
    notes: data.notes,
    timestamp: new Date(),
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

export const deserializeMonthlyBudget: Deserializer<MonthlyBudget> = function (id, data) {
  const parts = id.split('-');
  return {
    id,
    month: new Date(Number(parts[0]), Number(parts[1]), 0, 0, 0, 0, 0),
    amounts: data.amounts.map((item: BudgetItem) => ({
      category: item.category.id,
      budget: item.budget,
      spent: item.spent,
    })),
  };
};

export {
  deserializeTransactionCategory,
};
