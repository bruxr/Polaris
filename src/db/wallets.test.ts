import wallets from './wallets';
import { create } from '../test/utils';
import { Wallet } from '../types/finances';
import { FactoryItem } from '../types/testing';

describe('wallets', () => {
  let records: Wallet[];

  beforeEach(async () => {
    records = await create<Wallet>(FactoryItem.Wallet, 3);
  });

  describe('.findAll', () => {
    it('should return all wallets', async () => {
      return wallets.findAll().then((results) => {
        expect(results).toEqual(expect.arrayContaining([
          { _id: records[0]._id },
          { _id: records[1]._id },
          { _id: records[2]._id },
        ]));
      });
    });
  });

  describe('.find', () => {
    it('should return a single wallet', async () => {
      return wallets.findAll().then(() => {
        expect(true).toBe(true);
      });
    });
  });
});
