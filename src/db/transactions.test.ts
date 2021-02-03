import parseISO from 'date-fns/parseISO';

import { build } from '../test/utils';
import { FactoryItem } from '../types/testing';
import { putTransaction } from './transactions';

describe('putTransaction()', () => {
  it('should create a record', async () => {
    const attrs = await build(FactoryItem.Transaction);
    const wallet = await putTransaction({
      ...attrs,
      date: parseISO(attrs.date),
      createdAt: parseISO(attrs.createdAt),
    });

    expect(wallet).not.toBeUndefined();
  });
});
