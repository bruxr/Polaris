import { DateTime } from 'luxon';

import { db } from '../services/firebase';
import { Wallet, WalletType } from '../types/finances';

export const createWallet = async (name: string, type: WalletType, balance?: number): Promise<Wallet> => {
  const now = DateTime.utc();
  const data = {
    name,
    type,
    balance: balance ? balance * 100 : 0,
    ts: now.toJSDate(),
  };
  const doc = await db.collection('wallets').add(data);

  return {
    id: doc.id,
    ...data,
    ts: now,
  };
};
