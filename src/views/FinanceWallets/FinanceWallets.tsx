import React, { useEffect, useState } from 'react';

import classnames from 'classnames';
import { loader } from 'graphql.macro';
import { useQuery } from '@apollo/client';
import { useSetRecoilState, useResetRecoilState } from 'recoil';

import WalletCard from './WalletCard';
import WalletForm from './WalletForm';
import Sheet from '../../components/Sheet';
import { Wallet } from '../../types/finances';
import Spinner from '../../components/Spinner';
import addBtnAtom from '../../atoms/add-button';

const FIND_ALL_WALLETS = loader('./FindAllWallets.graphql');

export default function FinanceWallets(): React.ReactElement {
  const { data, loading } = useQuery<{ allWallets: { data: Wallet[] } }>(FIND_ALL_WALLETS);

  const setAddBtn = useSetRecoilState(addBtnAtom);
  const resetAddBtn = useResetRecoilState(addBtnAtom);

  const [showForm, setShowForm] = useState(false);
  const [editedWallet, setEditedWallet] = useState<Wallet | undefined>();

  useEffect(() => {
    setAddBtn({
      onClick: () => setShowForm(true),
    });

    return () => resetAddBtn();
  }, [setAddBtn, resetAddBtn]);

  return (
    <>
      <div
        className={classnames(
          'flex flex-col min-h-content min-w-full',
          { 'items-center': loading },
        )}
      >
        {loading && <Spinner />}
        {data && data.allWallets.data.map((wallet) => (
          <button
            key={wallet._id}
            type="button"
            onClick={() => {
              setEditedWallet(wallet);
              setShowForm(true);
            }}
          >
            <WalletCard wallet={wallet} />
          </button>
        ))}
      </div>

      {showForm && (
        <Sheet
          onClose={() => {
            setEditedWallet(undefined);
            setShowForm(false);
          }}
        >
          <WalletForm
            wallet={editedWallet}
            onSuccess={() => setShowForm(false)}
          />
        </Sheet>
      )}
    </>
  );
}
