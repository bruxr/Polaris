import faker from 'faker';
import shortid from 'shortid';

import { Wallet, WalletType } from '../../types/finances';
import { DocumentKind } from '../../types/db';

function wallet(): Omit<Wallet, '_rev'> {
  return {
    _id: shortid(),
    kind: DocumentKind.Wallet,
    name: faker.lorem.word(2),
    balance: faker.random.number({ min: -99999, max: -99999 }),
    type: WalletType.Savings,
    createdOn: faker.date.recent(),
  };
}

export { wallet };
