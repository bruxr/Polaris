import shortid from 'shortid';
import parseISO from 'date-fns/parseISO';
import formatISO from 'date-fns/formatISO';

import { getDb } from '../services/db';
import { Wallet } from '../types/finances';
import { findById } from '../services/queries';
import { getLastTransaction, putTransaction } from './transactions';
import { getTransactionCategoryByName } from './transactionCategories';
// import { getTransactionCategoryByName, putTransaction } from './finances';
import { DocumentKind, DocumentFields, TransientDocument } from '../types/db';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deserializeWallet(wallet: any): Wallet {
  return {
    ...wallet,
    createdAt: parseISO(wallet.createdAt),
  };
}

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

  return result.docs.map((doc) => deserializeWallet(doc));
}

/**
 * Retrieves a wallet with a given ID.
 *
 * @param id wallet ID
 */
async function getWallet(id: string): Promise<Wallet | null> {
  const wallet = await findById(DocumentKind.Wallet, id);

  return deserializeWallet(wallet);
}

/**
 * Saves a wallet to the database.
 *
 * @param id ID of wallet to be updated
 * @param wallet wallet data
 */
async function putWallet(
  wallet: Omit<Wallet, DocumentFields> & TransientDocument,
  balance: number,
  // opts?: { noTransaction: boolean },
): Promise<Wallet> {
  const db = getDb();
  const result = await db.put({
    ...wallet,
    _id: wallet._id || shortid(),
    kind: DocumentKind.Wallet,
    createdAt: formatISO(wallet.createdAt),
  });

  // If we need to update a wallet, create an adjustment transaction
  const now = new Date();
  const tx = {
    wallet: {
      _id: result.id,
      name: wallet.name,
    },
    date: now,
    createdAt: now,
  };
  if (wallet._id && wallet._rev) {
    const lastTx = await getLastTransaction({
      ...wallet,
      _id: wallet._id,
      kind: DocumentKind.Wallet,
    });
    if (!lastTx) {
      throw new Error('Cannot find previous transaction.');
    }

    const adjustmentCat = await getTransactionCategoryByName('Balance Adjustment');
    if (!adjustmentCat) {
      throw new Error('Cannot find transaction category for balance adjustment');
    }
    await putTransaction({
      ...tx,
      amount: balance - lastTx.balance,
      category: {
        _id: adjustmentCat._id,
        name: adjustmentCat.name,
      },
    });
  // Otherwise, create an initial transaction
  } else {
    const initialCat = await getTransactionCategoryByName('Initial');
    if (!initialCat) {
      throw new Error('Cannot find transaction category for initial transaction.');
    }
    await putTransaction({
      ...tx,
      amount: balance,
      category: {
        _id: initialCat._id,
        name: initialCat.name,
      },
    });
  }

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
