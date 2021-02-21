import React, { useMemo, useState } from 'react';
import useSWR from 'swr';
import classnames from 'classnames';
import format from 'date-fns/format';
import isToday from 'date-fns/isToday';
import entriesIn from 'lodash/entriesIn';
import isFuture from 'date-fns/isFuture';
import addMonths from 'date-fns/addMonths';
import subMonths from 'date-fns/subMonths';
import { Doughnut } from 'react-chartjs-2';
import isYesterday from 'date-fns/isYesterday';
import ChevronLeftSharp from '@material-ui/icons/ChevronLeftSharp';
import ChevronRightSharp from '@material-ui/icons/ChevronRightSharp';

import Sheet from '../../components/Sheet';
import useTitle from '../../hooks/use-title';
import TransactionForm from './TransactionForm';
import { Transaction } from '../../types/finances';
import { currency } from '../../services/currency';
import { CHART_COLORS } from '../../constants/charts';
import useAddButton from '../../hooks/use-add-button';
import { getTransactions } from '../../db/transactions';
import { getTransactionMonthStats } from '../../db/transactionMonthStats';

function Finances(): React.ReactElement {
  useTitle('Finances');

  const [month, setMonth] = useState<Date>(new Date());
  const monthSlug = useMemo(() => {
    return format(month, 'yyyy-MM');
  }, [month]);
  const isMaxMonth = useMemo(() => {
    return isFuture(addMonths(month, 1));
  }, [month]);

  const { data: transactions, mutate: mutateTransactions } = useSWR(
    [`transactions/${monthSlug}`, monthSlug, month],
    (key, monthSlug, month) => getTransactions(month),
  );
  const { data: stats, mutate: mutateStats } = useSWR(
    [`/transaction-stats/${monthSlug}`, monthSlug],
    (key, monthSlug) => getTransactionMonthStats(monthSlug),
  );

  const [showForm, setShowForm] = useState(false);
  const [transaction, setTransaction] = useState<Transaction | undefined>();

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
    setShowForm(true);
  });

  return (
    <div>
      <nav className="flex justify-center items-center mb-10">
        <button
          type="button"
          className="p-2 mr-2"
          onClick={() => setMonth(subMonths(month, 1))}
        >
          <ChevronLeftSharp />
        </button>
        {format(month, 'LLLL yyyy')}
        <button
          type="button"
          disabled={isMaxMonth}
          className={classnames(
            'p-2 ml-2',
            { 'text-gray-700': isMaxMonth },
          )}
          onClick={() => setMonth(addMonths(month, 1))}
        >
          <ChevronRightSharp />
        </button>
      </nav>

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
          <ul>
            {transactions.map((transaction) => (
              <li key={transaction._id} className="mb-3">
                <button
                  type="button"
                  className="flex justify-between w-full text-left"
                  onClick={() => {
                    setTransaction(transaction);
                    setShowForm(true);
                  }}
                >
                  <span>
                    <span className="block font-semibold">{transaction.category.name}</span>
                    <span className="text-sm text-gray-300">{transaction.notes}</span>
                  </span>
                  <span
                    className={classnames(
                      'flex justify-end items-center font-mono text-sm',
                      { 'text-green': transaction.amount > 0 },
                    )}
                  >
                    {transaction.amount > 0 && '+'}
                    {currency(transaction.amount)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <Sheet
        title="New Transaction"
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setTransaction(undefined);
        }}
      >
        <TransactionForm
          transaction={transaction}
          onSuccess={() => {
            setShowForm(false);
            setTransaction(undefined);
            mutateTransactions();
            mutateStats();
          }}
        />
      </Sheet>
    </div>
  );
}

export default Finances;
