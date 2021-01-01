import React from 'react';

import * as Yup from 'yup';
import { Formik, Form } from 'formik';

import Input from '../../components/Input';
import Button from '../../components/Button';
import Select from '../../components/Select';
import { TransactionCategoryType, TransactionCategory } from '../../types/finances';
import { putTransactionCategory, deleteTransactionCategory } from '../../db/finances';

type Props = {
  category?: TransactionCategory;
  onSuccess?: () => void;
}

const CategoryForm = ({ category, onSuccess }: Props): React.ReactElement => {
  return (
    <Formik
      initialValues={{
        name: category ? category.name : '',
        type: category ? category.type : TransactionCategoryType.Expense,
        notes: category && category.notes ? category.notes : '',
      }}
      validationSchema={Yup.object({
        name: Yup.string()
          .label('Name')
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
      onSubmit={async ({ name, type, notes }) => {
        const data = {
          name,
          type,
          notes,
        };
        await putTransactionCategory({
          ...category,
          ...data,
        });

        if (onSuccess) {
          onSuccess();
        }
      }}
    >
      {({ isSubmitting, setSubmitting }) => (
        <Form>
          <Input
            name="name"
            label="Name"
          />
          <Select
            name="type"
            label="Type"
            options={[
              { value: TransactionCategoryType.Expense, label: 'Expense' },
              { value: TransactionCategoryType.Income, label: 'Income' },
              { value: TransactionCategoryType.Other, label: 'Other' },
            ]}
          />
          <Input
            name="notes"
            label="Notes"
          />
          <Button type="submit" loading={isSubmitting} className="mb-2">Save</Button>
          {category && (
            <Button
              type="button"
              variant="link"
              onClick={() => {
                if (confirm(`Are you sure you want to delete ${category.name}?`)) {
                  setSubmitting(true);
                  deleteTransactionCategory(category).then(() => {
                    if (onSuccess) {
                      onSuccess();
                    }
                    setSubmitting(false);
                  });
                }
              }}
            >
              Delete
            </Button>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default CategoryForm;
