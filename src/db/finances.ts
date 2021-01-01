import shortid from 'shortid';
import slugify from 'slugify';
import set from 'date-fns/set';
import format from 'date-fns/format';
import getTime from 'date-fns/getTime';
import endOfMonth from 'date-fns/endOfMonth';
import startOfMonth from 'date-fns/startOfMonth';

import { DOC_TYPES } from '../constants/db';
import db, { findById } from '../services/db';
import { Transaction, TransactionCategory, Wallet } from '../types/finances';
import { DocumentKind, DocumentFields, TransientDocument } from '../types/db';

/**
 * Retrieves all wallets.
 */
async function getWallets(): Promise<Wallet[]> {
  const result = await db.find({
    selector: {
      kind: DOC_TYPES.WALLET,
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
async function putWallet(wallet: Omit<Wallet, DocumentFields> & TransientDocument): Promise<Wallet> {
  // If we are updating an existing wallet, we create a balance adjustment transaction
  if (wallet._id) {
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
    kind: DOC_TYPES.WALLET,
    createdOn: getTime(wallet.createdOn),
  });

  return {
    ...wallet,
    _id: result.id,
    _rev: result.rev,
    kind: DOC_TYPES.WALLET,
  };
}

/**
 * Retrieves all transaction categories.
 */
async function getTransactionCategories(): Promise<TransactionCategory[]> {
  const result = await db.find({
    selector: {
      kind: DOC_TYPES.TRANSACTION_CATEGORY,
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
    kind: DOC_TYPES.TRANSACTION_CATEGORY,
  });

  return {
    ...category,
    _id: result.id,
    _rev: result.rev,
    kind: DOC_TYPES.TRANSACTION_CATEGORY,
  };
}

/**
 * Deletes a transaction category.
 *
 * @param category transaction category that will be removed
 */
async function deleteTransactionCategory(category: TransactionCategory): Promise<void> {
  await db.remove(category);
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
    kind: DOC_TYPES.TRANSACTION,
    date: format(transaction.date, 'yyyy-MM-dd'),
    timestamp: getTime(transaction.timestamp),
  });

  return {
    ...transaction,
    _id: result.id,
    _rev: result.rev,
    kind: DOC_TYPES.TRANSACTION,
  };
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
