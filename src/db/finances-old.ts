import { formatISO } from 'date-fns/fp';

import { db, firestore } from '../services/firebase';
import {
  WalletType,
  Transaction,
  TransactionRecord,
  MonthlyTransactionStats,
  Budget,
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

/**
 * Creates a transaction in the database.
 * This also updates wallet balance and monthly statistics.
 * 
 * @param transaction transaction details
 */
export async function createTransaction(
  { walletId, categoryId, amount, date, notes, location }: Omit<Transaction, 'id'>,
): Promise<Transaction> {
  const data: Omit<TransactionRecord, 'id'> = {
    wallet: db.collection('wallets').doc(walletId),
    category: db.collection('transactionCategories').doc(categoryId),
    date,
    amount: amount * 100,
    ts: new Date(),
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
  const walletRef = db.collection('wallets').doc(walletId);
  const txRef = db.collection('transactions').doc();

  await db.runTransaction(async (t) => {
    const walletObj = await t.get(walletRef);

    t.set(txRef, data);
    t.update(walletRef, {
      balance: walletObj.data()?.balance + data.amount,
    });

    // Update monthly stats
    const categoryAmt = stats.categories[categoryId] ? stats.categories[categoryId] + data.amount : data.amount;
    if (walletObj.data()?.type === WalletType.Savings) {
      if (data.amount >= 0) {
        t.update(statsRef, {
          income: stats.income + data.amount,
          [`categories.${categoryId}`]: categoryAmt,
        });
      } else {
        t.update(statsRef, {
          expenses: stats.expenses + data.amount,
          [`categories.${categoryId}`]: categoryAmt,
        });
      }
    } else {
      t.update(statsRef, {
        expenses: stats.expenses + data.amount,
        [`categories.${categoryId}`]: categoryAmt,
      });
    }
  });

  return {
    _id: txRef.id,
    _rev: '',
    kind: '',
    walletId,
    categoryId,
    amount,
    date,
    timestamp: new Date(),
    notes: data.notes ? data.notes as string : undefined,
    location: location || undefined,
  };
}

/**
 * Creates a budget record for a given category.
 *
 * @param month month to put budget
 * @param category category ID
 * @param amount budgeted amount
 */
export async function createBudget(month: Date, category: string, amount: number): Promise<Budget> {
  const id = formatISO(month).substr(0, 7);

  // Run in one atomic transaction so all operations have the same values.
  await db.runTransaction(async (t) => {
    let spent = 0;
    const stats = await t.get(db.collection('transactionStats').doc(id));
    const statsData = stats.data();
    if (statsData && statsData.categories[category]) {
      spent = statsData.categories[category];
    }

    const budgetRef = db.collection('budgets').doc(id);
    const budget = await t.get(budgetRef);
    const budgetData = budget.data();
    if (budgetData) {
      const catIndex = budgetData.amounts.findIndex((item: { category: string }) => item.category = category);
      if (catIndex >= 0) {
        budgetData.amounts[catIndex].budget = amount * -1;
        budgetData.amounts[catIndex].spent = spent;
      } else {
        budgetData.amounts.push({
          category,
          budget: amount * -1,
          spent,
        });
      }

      t.set(budgetRef, budgetData);
    } else {
      t.set(budgetRef, {
        amounts: [{
          category: db.collection('transactionCategories').doc(category),
          budget: amount * -1,
          spent,
        }],
      });
    }
  });

  return {
    category,
    budget: amount * -1,
    spent: 0,
  };
}
