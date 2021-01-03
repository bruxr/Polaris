import db from '../services/db';
import { Wallet } from '../types/finances';
import { DocumentKind } from '../types/db';

const wallets = {
  findAll: async (): Promise<Wallet[]> => {
    const result = await db.find({
      selector: {
        kind: DocumentKind.Wallet,
      },
    });

    if (result.warning) {
      console.warn(result.warning);
    }

    return result.docs.map((doc) => ({
      ...(doc as Wallet),
    }));
  },
};

export default wallets;
