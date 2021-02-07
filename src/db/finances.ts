import { getDb } from '../services/db';
import { DocumentKind } from '../types/db';
import { findById } from '../services/queries';
import { TransactionMonthStats, TransactionCategory, TransactionCategoryType } from '../types/finances';

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
  const db = getDb();

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
  getTransactionMonthStats,
  updateTransactionMonthStats,
};
