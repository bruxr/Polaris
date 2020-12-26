import React from 'react';
import useSWR from 'swr';

import useTitle from '../../hooks/use-title';
import { getTransactions } from '../../db/finances';

function Finances(): React.ReactElement {
  useTitle('Finances');

  const { data: transactions } = useSWR('transactions', getTransactions);
  console.log(transactions);

  return (
    <div>
      Finances
    </div>
  );
}

export default Finances;
