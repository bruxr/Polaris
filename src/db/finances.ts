import endOfMonth from 'date-fns/endOfMonth';
import startOfMonth from 'date-fns/startOfMonth';

import db from '../services/db';
import { Wallet } from '../types/finances';

/**
 * Retrieves all transactions for the current month.
 */
async function getTransactions(): Promise<Wallet[]> {
  const now = new Date();
  const result = await db.find({
    selector: {
      _id: { $lte: endOfMonth(now), $gte: startOfMonth(now) },
      _type: 'transaction',
    },
  });

  if (result.warning) {
    console.warn(result.warning);
  }

  return result.docs.map((doc) => ({
    ...(doc as Wallet),
  }));
}

export {
  getTransactions,
};
