import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { format, parseISO } from 'date-fns';

import Input from '../../components/Input';
import Button from '../../components/Button';
import { db } from '../../services/firebase';
import { createTransaction } from '../../db/finances';
import { getLocation } from '../../services/geolocation';
import { Wallet, TransactionCategory } from '../../types/finances';
import { deserializeWallet, deserializeTransactionCategory } from '../../deserializers/finances';

type Props = {
  onCreate?: () => void;
}

export default function TransactionForm({ onCreate }: Props): React.ReactElement {
  const [wallets, setWallets] = useState<Wallet[] | null>(null);
  const [categories, setCategories] = useState<TransactionCategory[] | null>(null);
  useEffect(() => {
    const unsubWallets = db.collection('wallets')
      .orderBy('name', 'asc')
      .onSnapshot((snapshot) => {
        const wallets: Wallet[] = [];
        snapshot.forEach((doc) => {
          wallets.push(deserializeWallet(doc.id, doc.data()));
        });
        setWallets(wallets);
      });

    const unsubCategories = db.collection('transactionCategories')
      .orderBy('name', 'asc')
      .onSnapshot((snapshot) => {
        const categories: TransactionCategory[] = [];
        snapshot.forEach((doc) => {
          categories.push(deserializeTransactionCategory(doc.id, doc.data()));
        });
        setCategories(categories);
      });

    return () => {
      unsubWallets();
      unsubCategories();
    };
  }, []);

  if (!wallets || !categories) {
    return (
      <div>Loading...</div>
    );
  }

  return (
    <Formik
      initialValues={{
        wallet: wallets[0].id,
        category: categories[0].id,
        amount: '',
        notes: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        location: true,
      }}
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
          amount: Number(amount),
          date: parseISO(date),
          notes,
          location: coords,
        });

        if (onCreate) {
          onCreate();
        }
      }}
    >
      <Form>
        <Input
          name="wallet"
          as="select"
          label="Wallet"
        >
          {wallets !== null && wallets.map((wallet) => (
            <option key={wallet.id} value={wallet.id}>{wallet.name}</option>
          ))}
        </Input>
        <Input
          name="category"
          as="select"
          label="Category"
        >
          {categories !== null && categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </Input>
        <Input
          name="amount"
          type="number"
          label="Amount"
        />
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
    </Formik>
  );
}
