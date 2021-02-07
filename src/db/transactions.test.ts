import getTime from 'date-fns/getTime';
import subHours from 'date-fns/subHours';
import parseISO from 'date-fns/parseISO';

import { Wallet } from '../types/finances';
import { create, build } from '../test/utils';
import { FactoryItem } from '../types/testing';
import { putTransaction } from './transactions';

describe('putTransaction()', () => {
  let wallet: Wallet;
  beforeEach(async () => {
    wallet = (await create<Wallet>(FactoryItem.Wallet))[0];
    await create(FactoryItem.Transaction, 1, {
      _id: getTime(subHours(new Date(), 1)).toString(),
      category: {
        _id: 'initial',
        name: 'Initial',
      },
      wallet: {
        _id: wallet._id,
        name: wallet.name,
      },
      amount: 1000,
      balance: 1000,
    });
  });

  it('should create a record', async () => {
    const attrs = await build(FactoryItem.Transaction, {
      wallet: {
        _id: wallet._id,
        name: wallet.name,
      },
    });
    const transaction = await putTransaction({
      ...attrs,
      date: parseISO(attrs.date),
      createdAt: parseISO(attrs.createdAt),
    });

    expect(transaction).not.toBeUndefined();
  });

  it('should correctly calculate remaining balance', async () => {
    const now = new Date();
    const transaction = await putTransaction({
      category: {
        _id: 'fuel',
        name: 'Fuel',
      },
      wallet: {
        _id: wallet._id,
        name: wallet.name,
      },
      amount: -500,
      date: now,
      createdAt: now,
    });

    expect(transaction.balance).toEqual(500);
  });
});
