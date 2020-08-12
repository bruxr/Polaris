import { DateTime } from 'luxon';
import { formatISO } from 'date-fns/fp';

import { db, firestore } from '../services/firebase';
import {
  Wallet,
  WalletType,
  TransactionCategory,
  TransactionCategoryType,
  Transaction,
  TransactionRecord,
  MonthlyTransactionStats,
} from '../types/finances';

/**
 * Returns the transaction stats for a given month.
 * Creates a record in the database if the stats doesn't exist yet.
 * 
 * @param month month string in YYYY-MM format
 */
export async function getMonthStats(month: string): Promise<MonthlyTransactionStats> {
  const stats = await db.collection('transactionStats').doc(month).get();
  const data = stats.data();

  if (!data) {
    await db.collection('transactionStats').doc(month).set({
      expenses: 0,
      income: 0,
      categories: {},
    });
    return {
      month,
      expenses: 0,
      income: 0,
      categories: {},
    };
  }

  return {
    month,
    expenses: data.expenses,
    income: data.income,
    categories: data.categories,
  };
}

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

/**
 * Creates a transaction in the database.
 * This also updates wallet balance and monthly statistics.
 * 
 * @param transaction transaction details
 */
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

  // Get monthly stats
  const now = formatISO(new Date()).substr(0, 7);
  const stats = await getMonthStats(now);
  const statsRef = db.collection('transactionStats').doc(now);

  // Create references
  const walletRef = db.collection('wallets').doc(wallet);
  const txRef = db.collection('transactions').doc();

  await db.runTransaction(async (t) => {
    const walletObj = await t.get(walletRef);

    t.set(txRef, data);
    t.update(walletRef, {
      balance: walletObj.data()?.balance + data.amount,
    });

    // Update monthly stats
    const categoryAmt = stats.categories[category] ? stats.categories[category] + data.amount : data.amount;
    if (walletObj.data()?.type === WalletType.Savings) {
      if (data.amount >= 0) {
        t.update(statsRef, {
          income: stats.income + data.amount,
          [`categories.${category}`]: categoryAmt,
        });
      } else {
        t.update(statsRef, {
          expenses: stats.expenses + data.amount,
          [`categories.${category}`]: categoryAmt,
        });
      }
    } else {
      t.update(statsRef, {
        expenses: stats.expenses + data.amount,
        [`categories.${category}`]: categoryAmt,
      });
    }
  });

  return {
    id: txRef.id,
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
