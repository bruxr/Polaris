import slugify from 'slugify';

import { getDb } from '../services/db';
import { findById } from '../services/queries';
import { TransactionCategory } from '../types/finances';
import { DocumentKind, DocumentFields, TransientDocument } from '../types/db';

/**
 * Retrieves all transaction categories.
 */
async function getTransactionCategories(): Promise<TransactionCategory[]> {
  const db = getDb();
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
  return getTransactionCategory(id);
}

/**
 * Saves a transaction category to the database.
 *
 * @param category transaction category data
 */
async function putTransactionCategory(
  category: Omit<TransactionCategory, DocumentFields> & TransientDocument,
): Promise<TransactionCategory> {
  const db = getDb();
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
  const db = getDb();

  if (!category._rev) {
    throw new Error('Failed to delete category without rev string.');
  }

  await db.remove(category._id, category._rev);
}

export {
  getTransactionCategories,
  getTransactionCategory,
  getTransactionCategoryByName,
  putTransactionCategory,
  deleteTransactionCategory,
};
