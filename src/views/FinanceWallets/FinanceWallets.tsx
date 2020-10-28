import React from 'react';

import classnames from 'classnames';
import { loader } from 'graphql.macro';
import { useQuery } from '@apollo/client';

import WalletCard from './WalletCard';
import { Wallet } from '../../types/finances';
import Spinner from '../../components/Spinner';

const FIND_ALL_WALLETS = loader('./FindAllWallets.graphql');

export default function FinanceWallets(): React.ReactElement {
  const { data, loading } = useQuery<{ allWallets: { data: Wallet[] } }>(FIND_ALL_WALLETS);

  return (
    <div
      className={classnames(
        'flex min-h-content min-w-full',
        { 'items-center': loading },
      )}
    >
      {loading && <Spinner />}
      {data && data.allWallets.data.map((wallet) => (
        <WalletCard key={wallet._id} wallet={wallet} />
      ))}
    </div>
  );
}
