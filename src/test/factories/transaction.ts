import faker from 'faker';
import crypto from 'crypto';
import getTime from 'date-fns/getTime';
import formatISO from 'date-fns/formatISO';

import { DocumentKind } from '../../types/db';
import { Factory, FactoryItem } from '../../types/testing';
import { Wallet, TransactionCategory } from '../../types/finances';

const transaction: Factory = async ({ create }) => {
  const timestamp = faker.date.past();
  const amount = faker.random.number({ min: -99999, max: 99999 });
  const walletObj = (await create<Wallet>(FactoryItem.Wallet))[0];
  const category = (await create<TransactionCategory>(FactoryItem.TransactionCategory))[0];

  const data = {
    wallet: {
      _id: walletObj._id,
      name: walletObj.name,
    },
    category: {
      _id: category._id,
      name: category.name,
    },
    date: formatISO(timestamp),
    amount,
    balance: amount,
    createdAt: formatISO(timestamp),
  };

  return {
    _id: getTime(timestamp).toString(),
    kind: DocumentKind.Transaction,
    hash: crypto.createHash('sha256').update(JSON.stringify(data)).digest('base64'),
    ...data,
  };
};

export { transaction };
