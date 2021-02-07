import set from 'date-fns/set';
import getTime from 'date-fns/getTime';
import parseISO from 'date-fns/parseISO';
import formatISO from 'date-fns/formatISO';
import endOfMonth from 'date-fns/endOfMonth';
import startOfMonth from 'date-fns/startOfMonth';

import { getDb } from '../services/db';
import { findById } from '../services/queries';
import { Transaction, Wallet } from '../types/finances';
// import { putWallet, getWallet } from './wallets';
import { DocumentKind, DocumentFields, TransientDocument } from '../types/db';
// import { getTransactionCategory, updateTransactionMonthStats } from './finances';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deserializeTransaction(doc: any): Transaction {
  return {
    ...doc,
    date: parseISO(doc.date),
    createdAt: parseISO(doc.createdAt),
  };
}

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

  return result.docs.map((doc) => deserializeTransaction(doc));
}

/**
 * Returns the last transaction of a wallet.
 *
 * @param wallet filter transactios by this wallet
 */
async function getLastTransaction(wallet: Wallet): Promise<Transaction> {
  const db = getDb();
  const result = await db.find({
    selector: {
      'wallet._id': wallet._id,
      kind: DocumentKind.Transaction,
    },
    sort: [{ _id: 'desc' }],
    limit: 1,
  });
  if (result.warning) {
    console.warn(result.warning);
  }

  if (result.docs.length === 0) {
    throw new Error('Wallet has no transactions.');
  }

  return deserializeTransaction(result.docs[0]);
}

/**
 * Retrieves a single transaction.
 *
 * @param id transaction ID
 */
async function getTransaction(id: string): Promise<Transaction | null> {
  const transaction = findById(DocumentKind.Transaction, id);
  return deserializeTransaction(transaction);
}

/**
 * Saves a transaction to the database. This also updates its parent's 
 * wallet balance and monthly stats for the category.
 * 
 * @param transaction transaction data
 */
async function putTransaction(
  transaction: Omit<Transaction, DocumentFields | 'balance'> & TransientDocument,
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
  })).toString();

  // Calculate next balance
  // Here we check if there is a previous transaction, if so we add the amount to it
  // to calculate the next balance. Otherwise, we just use the amount as the balance.
  const prevTxResult = await db.find({
    selector: {
      _id: { $lt: id },
      'wallet._id': transaction.wallet._id,
      kind: DocumentKind.Transaction,
    },
    sort: [{ _id: 'desc' }],
    limit: 1,
  });
  if (prevTxResult.warning) {
    console.warn(prevTxResult.warning);
  }
  let balance = 0;
  if (prevTxResult.docs.length > 0) {
    balance = prevTxResult.docs[0].balance + transaction.amount;
  } else {
    balance = transaction.amount;
  }
  
  const data = {
    ...transaction,
    balance,
    _id: id.toString(),
    date: formatISO(transaction.date),
    createdAt: formatISO(now),
  };

  const result = await db.put({
    ...data,
    kind: DocumentKind.Transaction,
  });

  return {
    ...data,
    _id: result.id,
    _rev: result.rev,
    kind: DocumentKind.Transaction,
    date: transaction.date,
    createdAt: now,
  };
}

export {
  getTransactions,
  getLastTransaction,
  getTransaction,
  putTransaction,
};
