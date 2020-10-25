import React, { ReactElement } from 'react';

import classnames from 'classnames';

import { Wallet, WalletType } from '../../types/finances';

type Props = {
  wallet: Wallet;
}

export default function WalletCard({ wallet }: Props): ReactElement {
  return (
    <div
      className={classnames(
        'block w-full h-48 text-white p-4 text-left',
        {
          'bg-blue-600': wallet.type === WalletType.Savings,
          'bg-red-700': wallet.type === WalletType.Credit,
        },
      )}
    >
      <h3 className="font-semibold text-lg">{wallet.name}</h3>
      <span>{wallet.type === WalletType.Savings ? 'Savings' : 'Credit Card'}</span>
      <h4 className="text-3xl mt-16">P {wallet.balance.toLocaleString()}</h4>
    </div>
  );
}
