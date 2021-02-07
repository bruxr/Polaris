import React, { useMemo, useState, useEffect } from 'react';
import useSWR from 'swr';
import sortBy from 'lodash/sortBy';

import WalletForm from './WalletForm';
import Sheet from '../../components/Sheet';
import useTitle from '../../hooks/use-title';
import { getWallets } from '../../db/wallets';
import { currency } from '../../services/currency';
import useAddButton from '../../hooks/use-add-button';
import { Wallet, WalletType } from '../../types/finances';
import { getLastTransaction } from '../../db/transactions';

function FinancesWallets(): React.ReactElement {
  useTitle('Wallets');

  const { data: wallets, mutate } = useSWR('wallets', getWallets);

  const [showForm, setShowForm] = useState(false);
  const [editedWallet, setEditedWallet] = useState<Wallet | undefined>();
  const [balances, setBalances] = useState<Record<string, number>>({});

  const assets = useMemo(() => {
    if (!wallets) {
      return [];
    }

    const filtered = wallets.filter((wallet) => wallet.type === WalletType.Savings);
    return sortBy(filtered, 'name');
  }, [wallets]);
  const debt = useMemo(() => {
    if (!wallets) {
      return [];
    }

    const filtered = wallets.filter((wallet) => wallet.type === WalletType.Credit);
    return sortBy(filtered, 'name');
  }, [wallets]);

  useEffect(() => {
    if (!wallets) {
      return;
    }

    wallets.forEach((wallet) => {
      getLastTransaction(wallet).then((tx) => {
        setBalances((prev) => {
          const copy = { ...prev };
          copy[wallet._id] = tx.balance;
          return copy;
        });
      });
    });
  }, [wallets]);

  useAddButton(() => {
    setShowForm(true);
  });

  return (
    <>
      {assets.length > 0 && (
        <section className="border border-gray-700 p-4 mb-4">
          <h2 className="text-sm text-gray-500 mb-3">Assets</h2>
          <ul className="flex flex-col space-y-2">
            {assets && assets.map((asset) => (
              <li key={asset._id} className="w-full">
                <button
                  type="button"
                  className="flex justify-between w-full"
                  onClick={() => {
                    setEditedWallet(asset);
                    setShowForm(true);
                  }}
                >
                  <span className="font-semibold">{asset.name}</span>
                  <span className="font-mono font-light text-right">
                    {balances[asset._id] ? currency(balances[asset._id]) : ''}
                  </span>
                </button> 
              </li>
            ))}
          </ul>
        </section>
      )}

      {debt.length > 0 && (
        <section className="border border-gray-700 p-4 mb-4">
          <h2 className="text-sm text-gray-500 mb-3">Debt</h2>
          <ul className="flex flex-col space-y-2">
            {debt && debt.map((debt) => (
              <li key={debt._id} className="w-full">
                <button
                  type="button"
                  className="flex justify-between w-full"
                >
                  <span className="font-semibold">{debt.name}</span>
                  <span className="font-mono font-light text-right">
                    {balances[debt._id] ? currency(balances[debt._id]) : ''}
                  </span>
                </button> 
              </li>
            ))}
          </ul>
        </section>
      )}

      <Sheet
        title={editedWallet ? 'Edit Wallet' : 'New Wallet'}
        open={showForm}
        onClose={() => {
          setEditedWallet(undefined);
          setShowForm(false);
        }}
      >
        <WalletForm
          wallet={editedWallet}
          onSuccess={() => {
            setShowForm(false);
            mutate();
          }}
        />
      </Sheet>
    </>
  );
}

export default FinancesWallets;
