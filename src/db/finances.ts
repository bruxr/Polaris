import set from 'date-fns/set';
import format from 'date-fns/format';
import getTime from 'date-fns/getTime';
import endOfMonth from 'date-fns/endOfMonth';
import startOfMonth from 'date-fns/startOfMonth';

import db from '../services/db';
import { DOC_TYPES } from '../constants/db';
import { DocumentFields } from '../types/db';
import { Transaction, Wallet } from '../types/finances';

/**
 * Retrieves all wallets.
 */
async function getWallets(): Promise<Wallet[]> {
  const result = await db.find({
    selector: {
      _type: 'wallet',
    },
  });

  if (result.warning) {
    console.warn(result.warning);
  }

  return result.docs.map((doc) => ({
    ...(doc as Wallet),
  }));
}

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

async function putTransaction(transaction: Omit<Transaction, DocumentFields>): Promise<Transaction> {
  const id = getTime(set(new Date(), {
    year: transaction.date.getFullYear(),
    month: transaction.date.getMonth(),
    date: transaction.date.getDate(),
  }));
  const result = await db.put({
    ...transaction,
    _id: id.toString(),
    _type: DOC_TYPES.TRANSACTION,
    date: format(transaction.date, 'yyyy-MM-dd'),
    timestamp: getTime(transaction.timestamp),
  });

  return {
    ...transaction,
    _id: result.id,
    _rev: result.rev,
    _type: DOC_TYPES.TRANSACTION,
  };
}

export {
  getWallets,
  getTransactions,
  putTransaction,
};
