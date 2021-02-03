import shortid from 'shortid';
import slugify from 'slugify';
import set from 'date-fns/set';
import format from 'date-fns/format';
import getTime from 'date-fns/getTime';
import parseISO from 'date-fns/parseISO';
import endOfMonth from 'date-fns/endOfMonth';
import startOfMonth from 'date-fns/startOfMonth';

import db from '../services/db';
import { findById } from '../services/queries';
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
  getTransactionCategories,
  getTransactionCategory,
  getTransactionCategoryByName,
  putTransactionCategory,
  deleteTransactionCategory,
  getTransactionMonthStats,
  updateTransactionMonthStats,
};
