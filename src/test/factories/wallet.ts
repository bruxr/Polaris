import faker from 'faker';
import shortid from 'shortid';
import formatISO from 'date-fns/formatISO';

import { Factory } from '../../types/testing';
import { DocumentKind } from '../../types/db';
import { WalletType } from '../../types/finances';

const wallet: Factory = () => {
  return {
    _id: shortid(),
    kind: DocumentKind.Wallet,
    name: faker.lorem.word(2),
    balance: faker.random.number({ min: -99999, max: 99999 }),
    type: WalletType.Savings,
    createdOn: formatISO(faker.date.recent()),
  };
};

export { wallet };
