import React from 'react';
import useSWR from 'swr';

import useTitle from '../../hooks/use-title';
import { getTransactions } from '../../db/finances';
import useAddButton from '../../hooks/use-add-button';

function Finances(): React.ReactElement {
  useTitle('Finances');

  const { data: transactions } = useSWR('transactions', getTransactions);

  useAddButton(() => {
    console.log('clicked');
  });

  return (
    <div>
      <section className="my-10">
        <div className="border-primary border-4 w-56 h-56 mx-auto rounded-full" />
      </section>

      Finances
    </div>
  );
}

export default Finances;
