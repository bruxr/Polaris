import React, { useState, useEffect, useCallback, useMemo } from 'react';

import sortBy from 'lodash/sortBy';
import { loader } from 'graphql.macro';
import mapValues from 'lodash/mapValues';
import { useSetRecoilState } from 'recoil';

import CategoryForm from './CategoryForm';
import Sheet from '../../components/Sheet';
import useQuery from '../../hooks/use-query';
import addBtnAtom from '../../atoms/add-button';
import { deserializeTransactionCategory } from '../../deserializers/finances';
import { TransactionCategory, TransactionCategoryType } from '../../types/finances';

const ALL_TRANSACTION_CATEGORIES = loader('../../graphql/queries/AllTransactionCategories.graphql');

const FinancesCategories = (): React.ReactElement => {
  const setAddBtn = useSetRecoilState(addBtnAtom);

  const categories = useQuery<TransactionCategory>(ALL_TRANSACTION_CATEGORIES, deserializeTransactionCategory);
  console.log(categories);

  const [showAdd, setShowAdd] = useState(false);
  const [editedCategory, setEditedCategory] = useState<TransactionCategory | null>(null);

  const grouped = useMemo(() => {
    if (!categories) {
      return;
    }

    const groups: {
      [TransactionCategoryType.Income]: TransactionCategory[],
      [TransactionCategoryType.Expense]: TransactionCategory[],
      [TransactionCategoryType.Other]: TransactionCategory[],
    } = {
      [TransactionCategoryType.Income]: [],
      [TransactionCategoryType.Expense]: [],
      [TransactionCategoryType.Other]: [],
    };
    categories.forEach((record) => groups[record.type].push(record));

    return mapValues(groups, (items) => {
      return sortBy(items, ['color', 'name']);
    });

  }, [categories]);

  const handleSheetClose = useCallback(() => {
    setShowAdd(false);
    setEditedCategory(null);
  }, []);

  useEffect(() => {
    setAddBtn({
      onClick: () => setShowAdd(true),
    });

    return () => setAddBtn({
      onClick: undefined,
    });
  }, [setAddBtn]);

  if (!grouped) {
    return (
      <div>
        Please wait...
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">Categories</h2>
      {grouped[TransactionCategoryType.Income].length > 0 && (
        <div>
          <h3>Income</h3>
          <div className="divide-y">
            {grouped[TransactionCategoryType.Income].map((category) => (
              <button
                key={category.id}
                type="button"
                className="block mb-2"
              >
                <span className="block">{category.name}</span>
                <span className="block">{category.notes}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {grouped[TransactionCategoryType.Expense].length > 0 && (
        <div>
          <h3>Expense</h3>
          <div className="divide-y">
            {grouped[TransactionCategoryType.Expense].map((category) => (
              <button
                key={category.id}
                type="button"
                className="block mb-2"
              >
                <span className="block">{category.name}</span>
                <span className="block">{category.notes}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {grouped[TransactionCategoryType.Other].length > 0 && (
        <div>
          <h3>Other</h3>
          <div className="divide-y">
            {grouped[TransactionCategoryType.Other].map((category) => (
              <button
                key={category.id}
                type="button"
                className="block mb-2"
              >
                <span className="block">{category.name}</span>
                <span className="block">{category.notes}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {(showAdd || editedCategory) && (
        <Sheet title="Create Category" onClose={handleSheetClose}>
          <CategoryForm category={editedCategory || undefined} onSave={handleSheetClose} />
        </Sheet>
      )}
    </div>
  );
};

export default FinancesCategories;
