import React, { useMemo, useState } from 'react';
import useSWR from 'swr';
import * as Yup from 'yup';
import sortBy from 'lodash/sortBy';
import parse from 'date-fns/parse';
import classnames from 'classnames';
import format from 'date-fns/format';
import entriesIn from 'lodash/entriesIn';
import startOfDay from 'date-fns/startOfDay';
import { Formik, Form, FormikProps } from 'formik';

import Input from '../../components/Input';
import Button from '../../components/Button';
import Select from '../../components/Select';
import Checkbox from '../../components/Checkbox';
import Datepicker from '../../components/Datepicker';
import { getLocation } from '../../services/geolocation';
import {
  getTransactionCategories,
  getTransactionCategory,
  getWallets,
  getWallet,
  putTransaction,
} from '../../db/finances';
import { TransactionCategoryType } from '../../types/finances';

type FormValues = {
  walletId: string,
  categoryId: string,
  amount: number,
  date: string,
  notes: string,
  location: boolean,
}

function CreateTransactionForm(): React.ReactElement {
  const { data: wallets } = useSWR('/wallets', getWallets);
  const { data: categories } = useSWR('/transaction-categories', getTransactionCategories);

  const [sign, setSign] = useState<'-' | '+'>('-');

  const groupedCategories = useMemo(() => {
    if (!categories) {
      return [];
    }

    const groups: Array<{ label: string, children: Array<{ label: string, value: string }> }> = [];
    entriesIn(TransactionCategoryType).forEach(([label, key]) => {
      const items = sortBy(categories.filter((category) => category.type === key), 'name');
      if (items.length > 0) {
        groups.push({
          label,
          children: items.map((item) => ({ label: item.name, value: item._id })),
        });
      }
    });

    return groups;
  }, [categories]);

  if (!wallets || !categories) {
    return <></>;
  }

  const initialValues: FormValues = {
    walletId: wallets ? wallets[0]._id : '',
    categoryId: categories ? categories[0]._id : '',
    amount: 0,
    date: format(new Date(), 'Y-MM-dd'),
    notes: '',
    location: true,
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object({
        walletId: Yup.string()
          .label('Wallet')
          .required(),
        categoryId: Yup.string()
          .label('Category')
          .required(),
        amount: Yup.number()
          .label('Amount')
          .required(),
        date: Yup.string()
          .label('Date')
          .required(),
      })}
      onSubmit={async ({ walletId, categoryId, amount, date, notes, location }) => {
        const timestamp = new Date();

        let coords: [number, number] | undefined;
        if (location) {
          coords = await getLocation();
        }

        const wallet = await getWallet(walletId);
        if (!wallet) {
          throw new Error('Cannot find selected wallet.');
        }
        const category = await getTransactionCategory(categoryId);
        if (!category) {
          throw new Error('Cannot find selected transaction category.');
        }

        await putTransaction({
          wallet: {
            _id: wallet._id,
            name: wallet.name,
          },
          category: {
            _id: category._id,
            name: category.name,
          },
          amount: sign === '+' ? amount : amount * -1,
          date: startOfDay(parse(date, 'yyyy-MM-dd', timestamp)),
          notes: notes || undefined,
          location: coords,
          timestamp,
        });
      }}
    >
      {({ values, setFieldValue }: FormikProps<FormValues>) => (
        <Form>
          <div className="flex justify-center -ml-4">
            <button
              type="button"
              className={classnames('p-2 w-8', sign === '+' ? 'text-green' : 'text-red')}
              onClick={() => setSign((sign) => sign === '+' ? '-' : '+')}
            >
              {sign}
            </button>
            <input
              type="text"
              value={values.amount}
              className={classnames(
                'bg-transparent font-mono text-4xl tracking-tighter',
                sign === '+' ? 'text-green' : 'text-red',
              )}
              size={values.amount.toString().length}
              style={{ width: `${values.amount.toString().length}ch` }}
              onChange={(e) => {
                const value = Number(e.currentTarget.value);
                if (!Number.isNaN(value)) {
                  setFieldValue('amount', value);
                }
              }}
            />
          </div>
          <Select
            name="walletId"
            label="Wallet"
            options={wallets
              ? wallets.map((wallet) => ({ value: wallet._id, label: wallet.name }))
              : []
            }
          />
          <Select
            name="categoryId"
            label="Category"
            options={groupedCategories}
          />
          <Datepicker
            label="Date"
            name="date"
          />
          <Input
            label="Notes"
            name="notes"
          />
          <Checkbox
            label="Use Location"
            name="location"
          />

          <div className="mt-8">
            <Button type="submit">Save</Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default CreateTransactionForm;
