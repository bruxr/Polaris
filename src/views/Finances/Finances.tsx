import React, { useMemo, useState } from 'react';
import useSWR from 'swr';
import classnames from 'classnames';
import format from 'date-fns/format';
import isToday from 'date-fns/isToday';
import entriesIn from 'lodash/entriesIn';
import { Doughnut } from 'react-chartjs-2';
import isYesterday from 'date-fns/isYesterday';

import Sheet from '../../components/Sheet';
import useTitle from '../../hooks/use-title';
import { Transaction } from '../../types/finances';
import { CHART_COLORS } from '../../constants/charts';
import { getTransactionMonthStats, getTransactions } from '../../db/finances';
import useAddButton from '../../hooks/use-add-button';
import CreateTransactionForm from './CreateTransactionForm';
import { currency } from '../../services/currency';

function Finances(): React.ReactElement {
  useTitle('Finances');

  const month = format(new Date(), 'yyyy-MM');

  const { data: transactions, mutate: mutateTransactions } = useSWR('transactions', getTransactions);
  const { data: stats, mutate: mutateStats } = useSWR(
    [`/transaction-stats/${month}`, month],
    (key, month) => getTransactionMonthStats(month),
  );

  const [createTransaction, setCreateTransaction] = useState(false);

  const chartData = useMemo(() => {
    if (!stats) {
      return undefined;
    }

    const data: number[] = [];
    const labels: string[] = [];
    Object.values(stats.categories).forEach((item) => {
      if (item.amount < 0) {
        data.push(Math.abs(item.amount / 100));
        labels.push(item.category.name);
      }
    });

    const colors = CHART_COLORS.slice(0, data.length);

    return {
      data,
      labels,
      colors,
    };
  }, [stats]);
  const byDay = useMemo(() => {
    if (!transactions) {
      return [];
    }

    const days: Record<string, { label: string, transactions: Transaction[] }> = {};
    transactions.forEach((transaction) => {
      const key = format(transaction.date, 'yyyy-MM-dd');
      if (!days[key]) {
        let label = format(transaction.date, 'MMMM d');
        if (isToday(transaction.date)) {
          label = 'Today';
        } else if (isYesterday(transaction.date)) {
          label = 'Yesterday';
        }

        days[key] = { label, transactions: [] };
      }

      days[key].transactions.push(transaction);
    });
  
    return entriesIn(days);
  }, [transactions]);

  useAddButton(() => {
    setCreateTransaction(true);
  });

  return (
    <div>
      <section className="my-6">
        {chartData && (
          <div className="relative h-48">
            <Doughnut
              data={{
                datasets: [{
                  data: chartData.data,
                  backgroundColor: chartData.colors,
                }],
                labels: chartData.labels,
              }}
              options={{
                cutoutPercentage: 95,
                legend: false,
                elements: {
                  arc: {
                    borderWidth: 0,
                  },
                },
              }}
            />
          </div>
        )}
      </section>

      {byDay.map(([, { label, transactions }]) => (
        <section key={label} className="mb-8">
          <h3 className="text-sm text-gray-500 mb-4">{label}</h3>
          <dl className="grid grid-cols-2 gap-4">
            {transactions.map((transaction) => (
              <React.Fragment key={transaction._id}>
                <dt>
                  <span className="block font-semibold">{transaction.category.name}</span>
                  <span className="text-sm text-gray-300">{transaction.notes}</span>
                </dt>
                <dd
                  className={classnames(
                    'flex justify-end items-center font-mono text-sm',
                    { 'text-green': transaction.amount > 0 },
                  )}
                >
                  {transaction.amount > 0 && '+'}
                  {currency(transaction.amount)}
                </dd>
              </React.Fragment>
            ))}
          </dl>
        </section>
      ))}

      <Sheet
        title="New Transaction"
        open={createTransaction}
        onClose={() => setCreateTransaction(false)}
      >
        <CreateTransactionForm
          onSuccess={() => {
            setCreateTransaction(false);
            mutateTransactions();
            mutateStats();
          }}
        />
      </Sheet>
    </div>
  );
}

export default Finances;
