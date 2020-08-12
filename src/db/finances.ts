import { DateTime } from 'luxon';

import { db, firestore } from '../services/firebase';
import {
  Wallet,
  WalletType,
  TransactionCategory,
  TransactionCategoryType,
  Transaction,
  TransactionRecord,
} from '../types/finances';

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

export async function createTransaction(
  { wallet, category, amount, date, notes, location }: Omit<Transaction, 'id'>
): Promise<Transaction> {
  const data: Omit<TransactionRecord, 'id'> = {
    wallet: db.collection('wallets').doc(wallet),
    category: db.collection('transactionCategories').doc(category),
    date,
    amount: amount * 100,
  };

  if (notes && notes.trim()) {
    data.notes = notes.trim();
  }
  if (location) {
    data.location = new firestore.GeoPoint(location[0], location[1]);
  }

  const doc = await db.collection('transactions').add(data);

  return {
    id: doc.id,
    wallet,
    category,
    amount,
    date,
    notes: data.notes ? data.notes as string : undefined,
    location: location || undefined,
  };
}

/**
 * Creates a transaction category.
 *
 * @param name category name
 * @param icon category icon
 * @param type category type
 * @param notes optional category notes
 */
export const createTransactionCategory = async (
  name: string,
  icon: string,
  type: TransactionCategoryType,
  notes?: string
): Promise<TransactionCategory> => {
  const data: Omit<TransactionCategory, 'id'> = {
    name,
    icon,
    type,
  };
  if (notes && notes.trim() !== '') {
    data.notes = notes;
  }

  const doc = await db.collection('transactionCategories').add(data);

  return {
    id: doc.id,
    ...data,
  };
};

/**
 * Updates an existing category ID.
 *
 * @param id category id
 * @param name category name
 * @param icon category icon
 * @param type category type
 * @param notes optional category notes
 */
export const updateTransactionCategory = async (
  id: string,
  name: string,
  icon: string,
  type: TransactionCategoryType,
  notes?: string
): Promise<TransactionCategory> => {
  const data: Omit<TransactionCategory, 'id'> = {
    name,
    icon,
    type,
  };
  if (notes && notes.trim() !== '') {
    data.notes = notes;
  }

  await db
    .collection('transactionCategories')
    .doc(id)
    .update(data);

  return {
    id,
    ...data,
  };
};
