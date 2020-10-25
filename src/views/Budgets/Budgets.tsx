import React, { useEffect, useState, useMemo } from 'react';

import { formatISO } from 'date-fns';
import sortBy from 'lodash-es/sortBy';
import { useSetRecoilState, useResetRecoilState } from 'recoil';

import BudgetForm from './BudgetForm';
import Sheet from '../../components/Sheet';
import { db } from '../../services/firebase';
import addBtnAtom from '../../atoms/add-button';
import useSnapshot from '../../hooks/use-snapshot';
import { TransactionCategoryType, Budget } from '../../types/finances';
import useSingleSnapshot from '../../hooks/use-single-snapshot';
import { deserializeMonthlyBudget, deserializeTransactionCategory } from '../../deserializers/finances';

export default function Budgets(): React.ReactElement {
  const setAddBtn = useSetRecoilState(addBtnAtom);
  const resetAddBtn = useResetRecoilState(addBtnAtom);

  const [addBudget, setAddBudget] = useState(false);

  const now = formatISO(new Date()).substr(0, 7);
  const budget = useSingleSnapshot(
    db.collection('budgets').doc(now),
    deserializeMonthlyBudget,
  );
  const categories = useSnapshot(
    db.collection('transactionCategories')
      .where('type', '==', TransactionCategoryType.Expense),
    deserializeTransactionCategory,
  );

  const budgets = useMemo<Array<Budget & { icon: string, name: string }> | null>(() => {
    if (!budget || !categories) {
      return null;
    }

    return sortBy(budget.amounts.map((budget) => {
      const category = categories.find((category) => category.id === budget.category);
      if (!category) {
        throw new Error(`Cannot find category ID ${budget.category}`);
      }
      return {
        ...budget,
        name: category.name,
        icon: category.icon,
      };
    }), 'name');
  }, [budget, categories]);

  useEffect(() => {
    setAddBtn({
      onClick: () => setAddBudget(true),
    });

    return () => resetAddBtn();
  }, [setAddBtn, resetAddBtn]);
  return (
    <>
      <div>
        {budgets ? budgets.map((budget) => {
          const amount = Math.abs(budget.budget / 100).toLocaleString();
          const width = (budget.spent / budget.budget) * 100;
          return (
            <button key={budget.category} type="button" className="block w-full mb-2">
              <span className="flex justify-between mb-2">
                <span className="font-bold text-lg">
                  <span role="img" aria-label={`${budget.name} Icon`} className="inline-block mr-2">{budget.icon}</span>
                  {budget.name}
                </span>
                <span>{amount}</span>
              </span>
              <span className="block relative h-3 bg-green-200 w-full">
                <span
                  className="absolute h-3 bg-green-600 left-0 top-0"
                  style={{ width: `${width}%` }}
                />
              </span>
            </button>
          );
        }) : (
          <span>Loading...</span>
        )}
      </div>

      {addBudget && (
        <Sheet
          title="Add Budget"
          onClose={() => setAddBudget(false)}
        >
          <BudgetForm onSaved={() => setAddBudget(false)} />
        </Sheet>
      )}
    </>
  );
}
