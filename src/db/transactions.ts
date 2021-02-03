import set from 'date-fns/set';
import format from 'date-fns/format';
import getTime from 'date-fns/getTime';
import parseISO from 'date-fns/parseISO';
import formatISO from 'date-fns/formatISO';
import endOfMonth from 'date-fns/endOfMonth';
import startOfMonth from 'date-fns/startOfMonth';

import { getDb } from '../services/db';
import { findById } from '../services/queries';
import { Transaction } from '../types/finances';
// import { putWallet, getWallet } from './wallets';
import { DocumentKind, DocumentFields, TransientDocument } from '../types/db';
// import { getTransactionCategory, updateTransactionMonthStats } from './finances';

/**
 * Retrieves all transactions for the current month.
 * 
 * @param month retrieve transactions for this month
 */
async function getTransactions(month: Date = new Date()): Promise<Transaction[]> {
  const db = getDb();

  const result = await db.find({
    selector: {
      _id: {
        $lte: getTime(endOfMonth(month)).toString(),
        $gte: getTime(startOfMonth(month)).toString(),
      },
      kind: DocumentKind.Transaction,
    },
    sort: [{ _id: 'desc' }],
  });

  if (result.warning) {
    console.warn(result.warning);
  }

  return result.docs.map((doc) => ({
    ...(doc as Transaction),
    date: parseISO(doc.date),
  }));
}

/**
 * Retrieves a single transaction.
 *
 * @param id transaction ID
 */
async function getTransaction(id: string): Promise<Transaction | null> {
  return findById(DocumentKind.Transaction, id);
}

/**
 * Saves a transaction to the database. This also updates its parent's 
 * wallet balance and monthly stats for the category.
 * 
 * @param transaction transaction data
 */
async function putTransaction(
  transaction: Omit<Transaction, DocumentFields> & TransientDocument,
): Promise<Transaction> {
  const db = getDb();
  // const monthKey = format(transaction.date, 'yyyy-MM');

  // If we're updating an existing transaction, we need to
  // revert any changes on wallet balances and transaction stats
  // if (transaction._id) {
  //   const oldTransaction = await getTransaction(transaction._id);
  //   if (!oldTransaction) {
  //     throw new Error('Cannot find original transaction record.');
  //   }

  //   const prevWallet = await getWallet(transaction.wallet._id);
  //   if (!prevWallet) {
  //     throw new Error('Cannot find previous wallet record.');
  //   }
  //   await putWallet({
  //     ...prevWallet,
  //     balance: prevWallet.balance - oldTransaction.amount,
  //   }, { noTransaction: true });

  //   const prevCategory = await getTransactionCategory(transaction.category._id);
  //   if (!prevCategory) {
  //     throw new Error('Cannot find previous transaction category.');
  //   }
  //   await updateTransactionMonthStats(prevCategory, monthKey, oldTransaction.amount * -1);
  // }

  // Update wallet balance
  // const wallet = await getWallet(transaction.wallet._id);
  // if (!wallet) {
  //   throw new Error('Cannot find transaction\'s parent wallet.');
  // }
  // await putWallet({
  //   ...wallet,
  //   balance: wallet.balance + transaction.amount,
  // }, { noTransaction: true });

  // Update monthly stats
  // const category = await getTransactionCategory(transaction.category._id);
  // if (!category) {
  //   throw new Error('Cannot find transaction\'s category.');
  // }
  // await updateTransactionMonthStats(category, monthKey, transaction.amount);

  const now = new Date();
  const id = transaction._id || getTime(set(transaction.date, {
    hours: now.getHours(),
    minutes: now.getMinutes(),
    seconds: now.getSeconds(),
    milliseconds: now.getMilliseconds(),
  }));
  const result = await db.put({
    ...transaction,
    _id: id.toString(),
    kind: DocumentKind.Transaction,
    date: formatISO(transaction.date),
    createdAt: formatISO(now),
  });

  return {
    ...transaction,
    _id: result.id,
    _rev: result.rev,
    kind: DocumentKind.Transaction,
  };
}

export {
  getTransactions,
  getTransaction,
  putTransaction,
};
