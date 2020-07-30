import React, { useState, useEffect, useCallback } from 'react';

import { useSetRecoilState } from 'recoil';

import CategoryForm from './CategoryForm';
import Sheet from '../../components/Sheet';
import { db } from '../../services/firebase';
import addBtnAtom from '../../atoms/add-button';
import { TransactionCategory, TransactionCategoryType } from '../../types/finances';
import { deserializeTransactionCategory } from '../../deserializers/finances';

const FinancesCategories = (): React.ReactElement => {
  const setAddBtn = useSetRecoilState(addBtnAtom);

  const [categories, setCategories] = useState<TransactionCategory[] | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editedCategory, setEditedCategory] = useState<TransactionCategory | null>(null);

  const handleSheetClose = useCallback(() => {
    setShowAdd(false);
    setEditedCategory(null);
  }, []);

  useEffect(() => {
    const unsubscribe = db
      .collection('transactionCategories')
      .orderBy('type', 'asc')
      .onSnapshot((snapshot) => {
        const categories: TransactionCategory[] = [];
        snapshot.forEach((doc) => {
          categories.push(deserializeTransactionCategory(doc.id, doc.data()));
        });
        setCategories(categories);
      });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setAddBtn({
      onClick: () => setShowAdd(true),
    });

    return () => setAddBtn({
      onClick: undefined,
    });
  }, [setAddBtn]);

  if (!categories) {
    return (
      <div>
        Please wait...
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">Categories</h2>
      <div className="divide-y">
        {categories.map((category) => {
          let type = '';
          switch (category.type) {
            case TransactionCategoryType.Expense:
              type = 'Expense';
              break;
            case TransactionCategoryType.Income:
              type = 'Income';
              break;
            case TransactionCategoryType.Other:
              type = 'Other';
              break;
          }
          return (
            <button
              key={category.id}
              type="button"
              className="relative block w-full mb-2 py-2 pl-8 text-left"
              onClick={() => setEditedCategory(category)}
            >
              <span role="img" aria-label="Fuel" className="text-xl mr-2 absolute top-2 left-0 mt-0">
                {category.icon}
              </span>
              <span className="block text-xl">{category.name}</span>
              <span className="block text-gray-600 text-sm">{type}</span>
            </button>
          );
        })}
      </div>

      {(showAdd || editedCategory) && (
        <Sheet title="Create Category" onClose={handleSheetClose}>
          <CategoryForm category={editedCategory || undefined} onSave={handleSheetClose} />
        </Sheet>
      )}
    </div>
  );
};

export default FinancesCategories;
