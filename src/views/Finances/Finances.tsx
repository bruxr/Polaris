import React from 'react';
import useSWR from 'swr';

import { getTransactions } from '../../db/finances';

function Finances(): React.ReactElement {
  const { data: transactions } = useSWR('transactions', getTransactions);
  console.log(transactions);

  return (
    <div>
      Finances
    </div>
  );
}

export default Finances;
