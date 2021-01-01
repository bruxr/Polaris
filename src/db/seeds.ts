import { TransactionCategoryType } from '../types/finances';
import { getTransactionCategoryByName, putTransactionCategory } from './finances';

async function seedTransactionCategories(): Promise<void> {
  const balAdjustment = await getTransactionCategoryByName('Balance Adjustment');
  if (!balAdjustment) {
    await putTransactionCategory({
      name: 'Balance Adjustment',
      type: TransactionCategoryType.Other,
      code: 'ADJUSTMENT',
    });
  }

  const transfer = await getTransactionCategoryByName('Transfer');
  if (!transfer) {
    await putTransactionCategory({
      name: 'Transfer',
      type: TransactionCategoryType.Other,
      code: 'TRANSFER',
    });
  }
}

async function seed(): Promise<void> {
  await Promise.all([
    seedTransactionCategories(),
  ]);
}

export {
  seed,
};
