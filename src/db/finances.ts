import shortid from 'shortid';
import slugify from 'slugify';
import set from 'date-fns/set';
import format from 'date-fns/format';
import getTime from 'date-fns/getTime';
import parseISO from 'date-fns/parseISO';
import endOfMonth from 'date-fns/endOfMonth';
import startOfMonth from 'date-fns/startOfMonth';

import db, { findById } from '../services/db';
import { DocumentKind, DocumentFields, TransientDocument } from '../types/db';
import {
  Transaction,
  TransactionMonthStats,
  TransactionCategory,
  TransactionCategoryType,
  Wallet,
} from '../types/finances';

/**
 * Retrieves all wallets.
 */
async function getWallets(): Promise<Wallet[]> {
  const result = await db.find({
    selector: {
      kind: DocumentKind.Wallet,
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
 * Retrieves a wallet with a given ID.
 *
 * @param id wallet ID
 */
async function getWallet(id: string): Promise<Wallet | null> {
  return findById(DocumentKind.Wallet, id);
}

/**
 * Saves a wallet to the database.
 *
 * @param id ID of wallet to be updated
 * @param wallet wallet data
 */
async function putWallet(
  wallet: Omit<Wallet, DocumentFields> & TransientDocument,
  opts?: { noTransaction: boolean },
): Promise<Wallet> {
  // If we are updating an existing wallet, we create a balance adjustment transaction
  const createTransaction = opts ? !opts.noTransaction : true;
  if (wallet._id && createTransaction) {
    const oldWallet = await db.get(wallet._id);
    if (oldWallet.balance !== wallet.balance) {
      const adjustmentCat = await getTransactionCategoryByName('Balance Adjustment');
      if (!adjustmentCat) {
        throw new Error('Cannot find balance adjustment category.');
      }

      const now = new Date();
      await putTransaction({
        wallet: {
          _id: wallet._id,
          name: wallet.name,
        },
        category: {
          _id: adjustmentCat._id,
          name: adjustmentCat.name,
        },
        amount: (wallet.balance - oldWallet.balance) * -1,
        date: now,
        timestamp: now,
      });
    }
  }

  const result = await db.put({
    ...wallet,
    _id: wallet._id || shortid(),
    kind: DocumentKind.Wallet,
    createdOn: getTime(wallet.createdOn),
  });

  return {
    ...wallet,
    _id: result.id,
    _rev: result.rev,
    kind: DocumentKind.Wallet,
  };
}

/**
 * Retrieves all transaction categories.
 */
async function getTransactionCategories(): Promise<TransactionCategory[]> {
  const result = await db.find({
    selector: {
      kind: DocumentKind.TransactionCategory,
    },
  });

  if (result.warning) {
    console.warn(result.warning);
  }

  return result.docs.map((doc) => ({
    ...(doc as TransactionCategory),
  }));
}

/**
 * Retrieves a transaction category with a given ID.
 *
 * @param id category id
 */
async function getTransactionCategory(id: string): Promise<TransactionCategory | null> {
  return findById(DocumentKind.TransactionCategory, id);
}

/**
 * Retrieves a transaction category that matches the given name.
 *
 * @param name category name
 */
async function getTransactionCategoryByName(name: string): Promise<TransactionCategory | null> {
  const id = slugify(name, { lower: true, strict: true });
  let doc;
  try {
    doc = await db.get(id);
    return doc;
  } catch (err) {
    return null;
  }
}

/**
 * Saves a transaction category to the database.
 *
 * @param category transaction category data
 */
async function putTransactionCategory(
  category: Omit<TransactionCategory, DocumentFields> & TransientDocument,
): Promise<TransactionCategory> {
  const result = await db.put({
    ...category,
    _id: category._id || slugify(category.name, { lower: true, strict: true }),
    kind: DocumentKind.TransactionCategory,
  });

  return {
    ...category,
    _id: result.id,
    _rev: result.rev,
    kind: DocumentKind.TransactionCategory,
  };
}

/**
 * Deletes a transaction category.
 *
 * @param category transaction category that will be removed
 */
async function deleteTransactionCategory(category: TransactionCategory): Promise<void> {
  if (!category._rev) {
    throw new Error('Failed to delete category without rev string.');
  }

  await db.remove(category._id, category._rev);
}

/**
 * Retrieves all transactions for the current month.
 */
async function getTransactions(): Promise<Transaction[]> {
  const now = new Date();
  const result = await db.find({
    selector: {
      _id: {
        $lte: getTime(endOfMonth(now)).toString(),
        $gte: getTime(startOfMonth(now)).toString(),
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
 * Saves a transactio to the database. This also updates its parent's 
 * wallet balance and monthly stats for the category.
 * 
 * @param transaction transaction data
 */
async function putTransaction(transaction: Omit<Transaction, DocumentFields>): Promise<Transaction> {
  // Update wallet balance
  const wallet = await getWallet(transaction.wallet._id);
  if (!wallet) {
    throw new Error('Cannot find transaction\'s parent wallet.');
  }
  await putWallet({
    ...wallet,
    balance: wallet.balance + transaction.amount,
  }, { noTransaction: true });

  // Update monthly stats
  const month = format(transaction.date, 'yyyy-MM');
  const category = await getTransactionCategory(transaction.category._id);
  if (!category) {
    throw new Error('Cannot find transaction\'s category.');
  }
  await updateTransactionMonthStats(category, month, transaction.amount);

  const id = getTime(set(new Date(), {
    year: transaction.date.getFullYear(),
    month: transaction.date.getMonth(),
    date: transaction.date.getDate(),
  }));
  const result = await db.put({
    ...transaction,
    _id: id.toString(),
    kind: DocumentKind.Transaction,
    date: format(transaction.date, 'yyyy-MM-dd'),
    timestamp: getTime(transaction.timestamp),
  });

  return {
    ...transaction,
    _id: result.id,
    _rev: result.rev,
    kind: DocumentKind.Transaction,
  };
}

/**
 * Updates transaction monthly statistics.
 * 
 * @param category category to be updated
 * @param month month to be updated in YYYY-MM format
 * @param amount amount to be added/subtracted
 */
async function updateTransactionMonthStats(
  category: TransactionCategory,
  month: string,
  amount: number,
): Promise<void> {
  let stats = await findById<TransactionMonthStats>(DocumentKind.TransactionMonthStats, month);
  if (!stats) {
    stats = {
      _id: month,
      kind: DocumentKind.TransactionMonthStats,
      categories: [],
    };
  }

  switch (category.type) {
    case TransactionCategoryType.Expense:
      stats.expenses = stats.expenses ? stats.expenses + amount : amount;
      break;
    case TransactionCategoryType.Income:
      stats.income = stats.income ? stats.income + amount : amount;
      break;
    case TransactionCategoryType.Other:
      stats.other = stats.other ? stats.other + amount : amount;
      break;
  }

  const index = stats.categories.findIndex((item) => item.category._id === category._id);
  if (index >= 0) {
    stats.categories[index].amount += amount;
  } else {
    stats.categories.push({
      category: {
        _id: category._id,
        name: category.name,
      },
      amount,
    });
  }

  await db.put({
    ...stats,
  });
}

export {
  getWallets,
  getWallet,
  putWallet,
  getTransactionCategories,
  getTransactionCategory,
  getTransactionCategoryByName,
  putTransactionCategory,
  deleteTransactionCategory,
  getTransactions,
  putTransaction,
};
