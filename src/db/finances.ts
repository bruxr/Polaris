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
 * 
 * @param month retrieve transactions for this month
 */
async function getTransactions(month: Date = new Date()): Promise<Transaction[]> {
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
 * Saves a transactio to the database. This also updates its parent's 
 * wallet balance and monthly stats for the category.
 * 
 * @param transaction transaction data
 */
async function putTransaction(
  transaction: Omit<Transaction, DocumentFields> & TransientDocument,
): Promise<Transaction> {
  const monthKey = format(transaction.date, 'yyyy-MM');

  // If we're updating an existing transaction, we need to
  // revert any changes on wallet balances and transaction stats
  if (transaction._id) {
    const oldTransaction = await getTransaction(transaction._id);
    if (!oldTransaction) {
      throw new Error('Cannot find original transaction record.');
    }

    const prevWallet = await getWallet(transaction.wallet._id);
    if (!prevWallet) {
      throw new Error('Cannot find previous wallet record.');
    }
    await putWallet({
      ...prevWallet,
      balance: prevWallet.balance - oldTransaction.amount,
    }, { noTransaction: true });

    const prevCategory = await getTransactionCategory(transaction.category._id);
    if (!prevCategory) {
      throw new Error('Cannot find previous transaction category.');
    }
    await updateTransactionMonthStats(prevCategory, monthKey, oldTransaction.amount * -1);
  }

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
  const category = await getTransactionCategory(transaction.category._id);
  if (!category) {
    throw new Error('Cannot find transaction\'s category.');
  }
  await updateTransactionMonthStats(category, monthKey, transaction.amount);

  const id = transaction._id || getTime(set(new Date(), {
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
 * Retrieve transaction statistics for a given month.
 *
 * @param month stats for this month in YYYY-MM format
 */
async function getTransactionMonthStats(month: string): Promise<TransactionMonthStats | null> {
  return findById<TransactionMonthStats>(DocumentKind.TransactionMonthStats, month);
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
  getTransactionCategories,
  getTransactionCategory,
  getTransactionCategoryByName,
  putTransactionCategory,
  deleteTransactionCategory,
  getTransactions,
  getTransaction,
  putTransaction,
  getTransactionMonthStats,
};
