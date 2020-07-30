import { DateTime } from 'luxon';
import { firestore } from 'firebase';

import { Wallet, TransactionCategory } from '../types/finances';

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
