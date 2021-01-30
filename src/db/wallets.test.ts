import { putWallet } from './wallets';
import { Wallet } from '../types/finances';
import { create, build } from '../test/utils';
import { FactoryItem } from '../types/testing';

describe('putWallet', () => {
  it('should create a record', async () => {
    const attrs = build(FactoryItem.Wallet);
    const wallet = await putWallet(attrs);

    expect(wallet._id).not.toBeUndefined();
  });
});

describe('getWallet', () => {
  let wallet: Wallet;

  beforeEach(async () => {
    wallet = (await create<Wallet>(FactoryItem.Wallet))[0];
  });

  it('should return a wallet', async () => {
    expect(wallet).not.toBeUndefined();
  });
});

describe('getWallets', () => {
  let wallets: Wallet[];

  beforeEach(async () => {
    wallets = await create<Wallet>(FactoryItem.Wallet);
  });

  it('should return a wallet', async () => {
    wallets.forEach((wallet) => expect(wallet).not.toBeUndefined());
  });
});
