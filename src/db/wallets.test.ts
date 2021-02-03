import parseISO from 'date-fns/parseISO';

import { Wallet } from '../types/finances';
import { create, build } from '../test/utils';
import { FactoryItem } from '../types/testing';
import { getWallet, getWallets, putWallet } from './wallets';

describe('putWallet', () => {
  it('should create a record', async () => {
    const attrs = await build(FactoryItem.Wallet);
    const wallet = await putWallet({
      ...attrs,
      createdOn: parseISO(attrs.createdOn),
    });

    expect(wallet._id).not.toBeUndefined();
  });
});

describe('getWallet', () => {
  let wallet: Wallet;

  beforeEach(async () => {
    wallet = (await create<Wallet>(FactoryItem.Wallet))[0];
  });

  it('should return a wallet', async () => {
    const result = await getWallet(wallet._id);
    expect(result).not.toBeUndefined();
    expect(result?.name).toEqual(wallet.name);
    expect(result?.balance).toEqual(wallet.balance);
  });
});

describe('getWallets', () => {
  let wallets: Wallet[];

  beforeEach(async () => {
    wallets = await create<Wallet>(FactoryItem.Wallet);
  });

  it('should return a wallet', async () => {
    const results = await getWallets();
    wallets.forEach((wallet) => {
      const result = results.find((item) => item._id === wallet._id);
      if (!result) {
        throw new Error(`Cannot find wallet ${wallet._id}`);
      }

      expect(result).not.toBeUndefined();
      expect(result?.name).toEqual(wallet.name);
      expect(result?.balance).toEqual(wallet.balance);
    });
  });
});
