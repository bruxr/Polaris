import React, { useState, useMemo, useCallback } from 'react';
import useSWR from 'swr';
import sortBy from 'lodash/sortBy';

import Card from '../../components/Card';
import CategoryForm from './CategoryForm';
import Sheet from '../../components/Sheet';
import useTitle from '../../hooks/use-title';
import useAddButton from '../../hooks/use-add-button';
import { getTransactionCategories } from '../../db/transactionCategories';
import { TransactionCategory, TransactionCategoryType } from '../../types/finances';

const FinancesCategories = (): React.ReactElement => {
  useTitle('Categories');

  const { data: categories, mutate } = useSWR('/categories', getTransactionCategories);

  const [showForm, setShowForm] = useState(false);
  const [editedCategory, setEditedCategory] = useState<TransactionCategory | undefined>();

  const income = useMemo(() => {
    if (!categories) {
      return [];
    }

    return sortBy(categories.filter((category) => category.type === TransactionCategoryType.Income), 'name');
  }, [categories]);
  const expenses = useMemo(() => {
    if (!categories) {
      return [];
    }

    return sortBy(categories.filter((category) => category.type === TransactionCategoryType.Expense), 'name');
  }, [categories]);
  const other = useMemo(() => {
    if (!categories) {
      return [];
    }

    return sortBy(categories.filter((category) => category.type === TransactionCategoryType.Other), 'name');
  }, [categories]);

  const editCategory = useCallback((category: TransactionCategory) => {
    if (category.code) {
      alert('This is a system category and cannot be edited.');
      return;
    }

    setEditedCategory(category);
    setShowForm(true);
  }, []);

  useAddButton(() => {
    setShowForm(true);
  });

  if (!categories) {
    return (
      <div>
        Please wait...
      </div>
    );
  }

  return (
    <div>
      {categories && categories.length === 0 && (
        <div
          className="text-sm text-gray-500 text-center h-content w-full
            fixed left-0 flex justify-center items-center"
        >
          No categories yet.
        </div>
      )}

      {income.length > 0 && (
        <Card title="Income">
          <div className="divide-y">
            <ul className="flex flex-col space-y-3">
              {income.map((category) => (
                <li key={category._id}>
                  <button
                    type="button"
                    className="block w-full text-left"
                    onClick={() => editCategory(category)}
                  >
                    <span className="block">{category.name}</span>
                    {category.notes && <span className="block text-gray-500 text-sm">{category.notes}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      )}

      {expenses.length > 0 && (
        <Card title="Expenses">
          <div className="divide-y">
            <ul className="flex flex-col space-y-3">
              {expenses.map((category) => (
                <li key={category._id}>
                  <button
                    type="button"
                    className="block w-full text-left"
                    onClick={() => editCategory(category)}
                  >
                    <span className="block">{category.name}</span>
                    {category.notes && <span className="block text-gray-500 text-sm">{category.notes}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      )}

      {other.length > 0 && (
        <Card title="Other">
          <div className="divide-y">
            <ul className="flex flex-col space-y-3">
              {other.map((category) => (
                <li key={category._id}>
                  <button
                    type="button"
                    className="block w-full text-left"
                    onClick={() => editCategory(category)}
                  >
                    <span className="block">{category.name}</span>
                    {category.notes && <span className="block text-gray-500 text-sm">{category.notes}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      )}

      <Sheet
        open={showForm}
        title="Category"
        onClose={() => {
          setShowForm(false);
          setEditedCategory(undefined);
        }}
      >
        <CategoryForm
          category={editedCategory}
          onSuccess={() => {
            setShowForm(false);
            mutate();
          }}
        />
      </Sheet>
    </div>
  );
};

export default FinancesCategories;
