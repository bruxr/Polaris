import faker from 'faker';

import { slug } from '../../services/strings';
import { DocumentKind } from '../../types/db';
import { Factory } from '../../types/testing';
import { TransactionCategory, TransactionCategoryType } from '../../types/finances';

const transactionCategory: Factory<TransactionCategory> = () => {
  const name = faker.lorem.word(2);

  return {
    _id: slug(name),
    kind: DocumentKind.TransactionCategory,
    name,
    type: faker.random.boolean() ? TransactionCategoryType.Expense : TransactionCategoryType.Income,
  };
};

export { transactionCategory };
