import toPairs from 'lodash-es/toPairs';
import { Link } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import { Carousel } from 'react-responsive-carousel';
import React, { useState, useEffect, useMemo } from 'react';
import { useSetRecoilState, useResetRecoilState } from 'recoil';
import { formatISO, formatDistanceToNow, startOfMonth, endOfMonth } from 'date-fns';

import WalletCard from './WalletCard';
import Sheet from '../../components/Sheet';
import AddWalletForm from './AddWalletForm';
import { db } from '../../services/firebase';
import { Wallet } from '../../types/finances';
import TransactionForm from './TransactionForm';
import addBtnAtom from '../../atoms/add-button';
import useSnapshot from '../../hooks/use-snapshot';
import useSingleSnapshot from '../../hooks/use-single-snapshot';
import {
  deserializeWallet,
  deserializeTransaction,
  deserializeStats,
  deserializeTransactionCategory,
} from '../../deserializers/finances';

export default function Finances(): React.ReactElement {
  const setAddBtn = useSetRecoilState(addBtnAtom);
  const resetAddBtn = useResetRecoilState(addBtnAtom);

  const [wallets, setWallets] = useState<Array<Wallet | null>>([]);
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [showAddTx, setShowAddTx] = useState(false);
  const now = formatISO(new Date()).substr(0, 7);

  const transactions = useSnapshot(
    db.collection('transactions')
      .where('date', '>=', startOfMonth(new Date()))
      .where('date', '<=', endOfMonth(new Date()))
      .orderBy('date', 'desc')
      .limit(10),
    deserializeTransaction,
  );

  const categories = useSnapshot(
    db.collection('transactionCategories').orderBy('name', 'asc'),
    deserializeTransactionCategory,
  );

  const stats = useSingleSnapshot(
    db.collection('transactionStats').doc(now),
    deserializeStats,
  );

  const categorizedTransactions = useMemo(() => {
    if (!transactions || !categories) {
      return null;
    }

    return transactions.map((tx) => ({
      ...tx,
      category: categories.find((cat) => cat.id === tx.category)?.name,
    }));
  }, [transactions, categories]);

  const categoryStats = useMemo(() => {
    if (!categories || !stats) {
      return null;
    }

    return toPairs(stats.categories).map(([id, amount]) => {
      const category = categories.find((category) => category.id === id);
      if (!category) {
        throw new Error(`Cannot find category #${id}.`);
      }

      return {
        ...category,
        amount,
      };
    });
  }, [categories, stats]);

  useEffect(() => {
    const unsubscribe = db.collection('wallets')
      .orderBy('name', 'asc')
      .onSnapshot((snapshot) => {
        const wallets: Array<Wallet | null> = [];
        snapshot.forEach((doc) => {
          wallets.push(deserializeWallet(doc.id, doc.data()));
        });
        wallets.push(null);
        setWallets(wallets);
      });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setAddBtn({
      onClick: () => setShowAddTx(true),
    });

    return () => resetAddBtn();
  }, [setAddBtn, resetAddBtn]);

  return (
    <div>
      <Carousel
        autoPlay={false}
        dynamicHeight={false}
        showArrows={false}
        showStatus={false}
        showThumbs={false}
        useKeyboardArrows={false}
      >
        {wallets.map((wallet) => wallet ? (
          <WalletCard key={wallet.id} wallet={wallet} />
        ) : (
          <button
            key="add"
            type="button"
            className="block w-full h-48 border border-dashed border-gray-500 text-gray-700 text-center"
            onClick={() => setShowAddWallet(true)}
          >
            <div className="block"><AddIcon /></div>
            Add Wallet
          </button>
        ))}
      </Carousel>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Transactions</h2>
        {categorizedTransactions ? (
          <ul>
            {categorizedTransactions.map((transaction) => (
              <li key={transaction.id} className="flex mb-2">
                <span>
                  <span className="block text-lg mb-1">{transaction.category}</span>
                  {transaction.notes && (<small className="block">{transaction.notes}</small>)}
                  <small className="block text-gray-600">{formatDistanceToNow(transaction.date)} ago</small>
                </span>
                <span className="font-bold ml-auto">{transaction.amount.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        ) : (
          <small>Loading...</small>
        )}
        <Link
          to="/finances/transactions"
          className="block text-blue-500 text-center"
        >
          All Transactions
        </Link>
      </section>

      <section className="my-4">
        <h2 className="text-2xl font-semibold mb-4">Budgets</h2>
        {categoryStats ? (
          <ul>
            {categoryStats.map((stat) => (
              <li key={stat.id} className="flex">
                {stat.icon}
                {stat.name}
                <span className="font-bold ml-auto">{stat.amount.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        ) : (
          <small>Loading...</small>
        )}
        <div className="flex">
          <Link
            to="/finances/categories"
            className="block text-blue-500 text-center p-4"
          >
            Manage Categories
          </Link>
          <Link
            to="/finances/budgets"
            className="block text-blue-500 text-center p-4"
          >
            Manage Budgets
          </Link>
        </div>
      </section>

      {showAddWallet && (
        <Sheet
          title="Add Wallet"
          onClose={() => setShowAddWallet(false)}
        >
          <AddWalletForm onCreate={() => setShowAddWallet(false)} />
        </Sheet>
      )}

      {showAddTx && (
        <Sheet
          title="Add Transaction"
          onClose={() => setShowAddTx(false)}
        >
          <TransactionForm onCreate={() => setShowAddTx(false)} />
        </Sheet>
      )}
    </div>
  );
}
