import React, { useState } from 'react';
import useSWR from 'swr';

import Sheet from '../../components/Sheet';
import useTitle from '../../hooks/use-title';
import { getTransactions } from '../../db/finances';
import useAddButton from '../../hooks/use-add-button';
import CreateTransactionForm from './CreateTransactionForm';

function Finances(): React.ReactElement {
  useTitle('Finances');

  const { data: transactions } = useSWR('transactions', getTransactions);

  const [createTransaction, setCreateTransaction] = useState(false);

  useAddButton(() => {
    setCreateTransaction(true);
  });

  console.log(transactions);

  return (
    <div>
      <section className="my-10">
        <div className="border-primary border-4 w-56 h-56 mx-auto rounded-full" />
      </section>

      Finances

      <Sheet
        title="New Transaction"
        open={createTransaction}
        onClose={() => setCreateTransaction(false)}
      >
        <CreateTransactionForm />
      </Sheet>
    </div>
  );
}

export default Finances;
