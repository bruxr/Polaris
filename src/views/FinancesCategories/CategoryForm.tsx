import React from 'react';

import * as Yup from 'yup';
import { Formik, Form } from 'formik';

import Input from '../../components/Input';
import Button from '../../components/Button';
import { createTransactionCategory, updateTransactionCategory } from '../../db/finances';
import { TransactionCategoryType, TransactionCategory } from '../../types/finances';

type Props = {
  category?: TransactionCategory;
}

const CategoryForm = ({ category }: Props): React.ReactElement => {
  return (
    <Formik
      initialValues={{
        name: category ? category.name : '',
        icon: category ? category.icon : '',
        type: category ? category.type : TransactionCategoryType.Expense,
        notes: category && category.notes ? category.notes : '',
      }}
      validationSchema={Yup.object({
        name: Yup.string()
          .label('Name')
          .required(),
        icon: Yup.string()
          .label('Icon')
          .max(2)
          .required(),
        type: Yup.string()
          .label('Type')
          .oneOf([
            TransactionCategoryType.Expense,
            TransactionCategoryType.Income,
            TransactionCategoryType.Other,
          ])
          .required(),
        notes: Yup.string()
          .label('Notes'),
      })}
      onSubmit={async ({ name, icon, type, notes }) => {
        if (category) {
          await updateTransactionCategory(category.id, name, icon, type, notes !== '' ? notes : undefined);
        } else {
          await createTransactionCategory(name, icon, type, notes !== '' ? notes : undefined);
        }
      }}
    >
      {({ errors, isSubmitting }) => (
        <Form>
          <Input
            name="name"
            label="Name"
            error={errors.name}
          />
          <Input
            name="icon"
            label="Icon"
            error={errors.icon}
            maxLength={2}
          />
          <Input
            as="select"
            name="type"
            label="Type"
          >
            <option value={TransactionCategoryType.Expense}>Expense</option>
            <option value={TransactionCategoryType.Income}>Income</option>
            <option value={TransactionCategoryType.Other}>Other</option>
          </Input>
          <Input
            as="textarea"
            name="notes"
            label="Notes"
            error={errors.notes}
          />
          <Button type="submit" loading={isSubmitting}>{category ? 'Save' : 'Create'}</Button>
        </Form>
      )}
    </Formik>
  );
};

export default CategoryForm;
