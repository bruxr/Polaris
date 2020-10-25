import React, { useEffect, useState } from 'react';

import * as Yup from 'yup';
import classnames from 'classnames';
import { format, parseISO } from 'date-fns';
import { Formik, Form, Field, FormikProps } from 'formik';

import Input from '../../components/Input';
import Button from '../../components/Button';
import { db } from '../../services/firebase';
import useSnapshot from '../../hooks/use-snapshot';
import { createTransaction } from '../../db/finances';
import { getLocation } from '../../services/geolocation';
import { deserializeTransactionCategory } from '../../deserializers/finances';
import { Wallet, TransactionCategory, TransactionCategoryType } from '../../types/finances';

type FormValues = {
  wallet: string;
  category: string;
  amount: string;
  notes: string;
  date: string;
  location: boolean;
}

type Props = {
  onCreate?: () => void;
}

export default function TransactionForm({ onCreate }: Props): React.ReactElement {
  const categories = useSnapshot<TransactionCategory>(
    db.collection('transactionCategories').orderBy('name', 'asc'),
    deserializeTransactionCategory,
  );
  
  const [wallets, setWallets] = useState<Wallet[] | null>(null);
  const [sign, setSign] = useState<'-' | '+'>('-');

  useEffect(() => {
    const unsubWallets = db.collection('wallets')
      .orderBy('name', 'asc')
      .onSnapshot((snapshot) => {
        const wallets: Wallet[] = [];
        snapshot.forEach((doc) => {
          // wallets.push(deserializeWallet(doc.id, doc.data()));
        });
        setWallets(wallets);
      });

    return () => {
      unsubWallets();
    };
  }, []);

  const initialValues: FormValues = {
    // wallet: wallets && wallets.length > 0 ? wallets[0].id : '',
    wallet: '',
    category: categories && categories.length > 0 ? categories[0].id : '',
    amount: '',
    notes: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    location: true,
  };

  if (!wallets || !categories) {
    return (
      <div>Loading...</div>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object({
        amount: Yup
          .number()
          .label('Amount'),
        note: Yup
          .string()
          .label('Note'),
      })}
      onSubmit={async ({ wallet, category, amount, date, notes, location }) => {
        let coords;
        if (location) {
          coords = await getLocation();
        }

        await createTransaction({
          wallet,
          category,
          amount: Number(`${sign}${amount}`),
          date: parseISO(date),
          notes,
          location: coords,
        });

        if (onCreate) {
          onCreate();
        }
      }}
    >
      {({ errors, setFieldValue }: FormikProps<FormValues>) => (
        <Form>
          <Input
            name="wallet"
            as="select"
            label="Wallet"
          >
            {/* {wallets !== null && wallets.map((wallet) => (
              <option key={wallet.id} value={wallet.id}>{wallet.name}</option>
            ))} */}
          </Input>
          <Input
            name="category"
            as="select"
            label="Category"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              const id = e.currentTarget.value;
              const category = categories.find((item) => item.id === id);
              
              setFieldValue('category', id);
              
              if (!category) {
                throw new Error(`Failed to find category ${id}`);
              }
              
              if (category.type === TransactionCategoryType.Expense) {
                setSign('-');
              } else {
                setSign('+');
              }
            }}
          >
            {categories !== null && categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </Input>
          <div className="mb-4">
            <label htmlFor="amount" className="block text-gray-700 mb-2">Amount</label>
            <div className="flex mb-2">
              <button
                type="button"
                className="border border-gray-400 p-2 w-12"
                onClick={() => setSign((prev) => prev === '-' ? '+' : '-')}
              >
                {sign}
              </button>
              <Field
                type="number"
                name="amount"
                inputmode="decimal"
                className={classnames(
                  'block border border-gray-400 p-2 flex-1 -ml-px',
                  { 'border-red-600': errors.amount },
                )}
              />
            </div>
          </div>
          <Input
            type="date"
            name="date"
            label="Date"
          />
          <Input
            name="notes"
            label="Notes"
          />
          <Input
            type="checkbox"
            name="location"
            label="Use Location"
          />
          <Button type="submit">Add Transaction</Button>
        </Form>
      )}
    </Formik>
  );
}
