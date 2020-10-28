import React from 'react';

import classnames from 'classnames';

import { currency } from '../../services/currency';
import { Wallet, WalletType } from '../../types/finances';

type Props = {
  wallet: Wallet;
}

export default function WalletCard({ wallet }: Props): React.ReactElement {
  return (
    <div
      className={classnames(
        'mb-8 p-6 text-gray-100 flex flex-col w-full h-48 bg-contain bg-right bg-no-repeat rounded-lg',
        {
          'bg-blue bg-savings-wallet': wallet.type === WalletType.Savings,
          'bg-red bg-savings-wallet': wallet.type === WalletType.Credit,
        },
      )}
      style={{ backgroundImage: 'url(/assets/images/wallets/savings.png)' }}
    >
      <h2 className="font-medium text-2xl">{wallet.name}</h2>
      <h3>{currency(wallet.balance)}</h3>

      <div className="opacity-50 mt-auto">
        {wallet.type === WalletType.Savings ? 'Savings' : null}
        {wallet.type === WalletType.Credit ? 'Credit Card' : null}
      </div>
    </div>
  );
}
