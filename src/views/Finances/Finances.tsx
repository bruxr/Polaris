import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import { Carousel } from 'react-responsive-carousel';

import WalletCard from './WalletCard';
import Sheet from '../../components/Sheet';
import AddWalletForm from './AddWalletForm';
import { db } from '../../services/firebase';
import { Wallet } from '../../types/finances';
import { deserializeWallet } from '../../deserializers/finances';

export default function Finances(): React.ReactElement {
  const [wallets, setWallets] = useState<Array<Wallet | null>>([]);
  const [showAddWallet, setShowAddWallet] = useState(false);

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
      </section>

      <section className="my-4">
        <h2 className="text-2xl font-semibold mb-4">Categories</h2>
        <Link
          to="/finances/categories"
          className="block text-blue-500"
        >
          Manage Categories
        </Link>
      </section>

      {showAddWallet && (
        <Sheet
          title="Add Wallet"
          onClose={() => setShowAddWallet(false)}
        >
          <AddWalletForm onCreate={() => setShowAddWallet(false)} />
        </Sheet>
      )}
    </div>
  );
}
