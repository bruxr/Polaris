import React from 'react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';

import Input from '../../components/Input';
import Button from '../../components/Button';
import { db } from '../../services/firebase';
import useSnapshot from '../../hooks/use-snapshot';
import { TransactionCategoryType } from '../../types/finances';
import { deserializeTransactionCategory } from '../../deserializers/finances';
import { createBudget } from '../../db/finances';

type Props = {
  onSaved?: () => void;
}

export default function BudgetForm({ onSaved }: Props): React.ReactElement {
  const categories = useSnapshot(
    db.collection('transactionCategories')
      .orderBy('name', 'asc')
      .where('type', '==', TransactionCategoryType.Expense),
    deserializeTransactionCategory,
  );

  if (!categories) {
    return (
      <span>Loading...</span>
    );
  }

  return (
    <Formik
      initialValues={{
        category: categories[0].id,
        amount: '',
      }}
      validationSchema={Yup.object({
        category: Yup.string()
          .label('Category')
          .required(),
        amount: Yup.number()
          .label('Budget amount')
          .required(),
      })}
      onSubmit={async ({ category, amount }) => {
        const now = new Date();
        await createBudget(now, category, Number(amount) * 100);
        if (onSaved) {
          onSaved();
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Input
            as="select"
            name="category"
            label="Category"
          >
            {categories !== null && categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </Input>
          <Input
            type="number"
            name="amount"
            label="Amount"
          />
          <Button type="submit" loading={isSubmitting}>Create Budget</Button>
        </Form>
      )}
    </Formik>
  );
}
