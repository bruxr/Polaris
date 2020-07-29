import { DateTime } from 'luxon';
import { firestore } from 'firebase';

import { Wallet } from '../types/finances';

export const deserializeWallet = (id: string, data: firestore.DocumentData): Wallet => {
  return {
    id,
    name: data.name,
    type: data.type,
    balance: data.balance / 100,
    ts: DateTime.fromSeconds(data.ts.seconds),
  };
};
