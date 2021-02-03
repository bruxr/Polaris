import shortid from 'shortid';
import getTime from 'date-fns/getTime';

import { getDb } from '../services/db';
import { Wallet } from '../types/finances';
import { findById } from '../services/queries';
// import { getTransactionCategoryByName, putTransaction } from './finances';
import { DocumentKind, DocumentFields, TransientDocument } from '../types/db';

/**
 * Retrieves all wallets.
 */
async function getWallets(): Promise<Wallet[]> {
  const db = getDb();

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
}

/**
 * Retrieves a wallet with a given ID.
 *
 * @param id wallet ID
 */
async function getWallet(id: string): Promise<Wallet | null> {
  return findById(DocumentKind.Wallet, id);
}

/**
 * Saves a wallet to the database.
 *
 * @param id ID of wallet to be updated
 * @param wallet wallet data
 */
async function putWallet(
  wallet: Omit<Wallet, DocumentFields> & TransientDocument,
  // opts?: { noTransaction: boolean },
): Promise<Wallet> {
  const db = getDb();

  // If we are updating an existing wallet, we create a balance adjustment transaction
  // const createTransaction = opts ? !opts.noTransaction : true;
  // if (wallet._id && createTransaction) {
  //   const oldWallet = await db.get<Wallet>(wallet._id);
  //   if (oldWallet.balance !== wallet.balance) {
  //     const adjustmentCat = await getTransactionCategoryByName('Balance Adjustment');
  //     if (!adjustmentCat) {
  //       throw new Error('Cannot find balance adjustment category.');
  //     }

  //     const now = new Date();
  //     await putTransaction({
  //       wallet: {
  //         _id: wallet._id,
  //         name: wallet.name,
  //       },
  //       category: {
  //         _id: adjustmentCat._id,
  //         name: adjustmentCat.name,
  //       },
  //       amount: (wallet.balance - oldWallet.balance) * -1,
  //       date: now,
  //       timestamp: now,
  //     });
  //   }
  // }

  const result = await db.put({
    ...wallet,
    _id: wallet._id || shortid(),
    kind: DocumentKind.Wallet,
    createdOn: getTime(wallet.createdOn),
  });

  return {
    ...wallet,
    _id: result.id,
    _rev: result.rev,
    kind: DocumentKind.Wallet,
  };
}

export {
  getWallet,
  getWallets,
  putWallet,
};
