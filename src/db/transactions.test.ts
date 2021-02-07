import parseISO from 'date-fns/parseISO';

import { build } from '../test/utils';
import { FactoryItem } from '../types/testing';
import { putTransaction } from './transactions';

describe('putTransaction()', () => {
  it('should create a record', async () => {
    const attrs = await build(FactoryItem.Transaction);
    const transaction = await putTransaction({
      ...attrs,
      date: parseISO(attrs.date),
      createdAt: parseISO(attrs.createdAt),
    });

    expect(transaction).not.toBeUndefined();
  });
});
