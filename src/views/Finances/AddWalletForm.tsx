import React from 'react';

import * as Yup from 'yup';
import { Formik, Form } from 'formik';

import Input from '../../components/Input';
import Button from '../../components/Button';
import { createWallet } from '../../db/finances';
import { WalletType, Wallet } from '../../types/finances';

interface Props {
  onCreate?: (wallet: Wallet) => void;
}

export default function AddWalletForm({ onCreate }: Props): JSX.Element {
  return (
    <Formik
      initialValues={{
        name: '',
        type: WalletType.Savings,
        balance: '',
      }}
      validationSchema={Yup.object({
        name: Yup.string()
          .label('Name')
          .required(),
        type: Yup.string()
          .label('Type')
          .oneOf([WalletType.Savings, WalletType.Credit])
          .required(),
        balance: Yup.number()
          .label('Initial balance'),
      })}
      onSubmit={async ({ name, type, balance }) => {
        const wallet = await createWallet(name, type, Number(balance) || 0);
        if (onCreate) {
          onCreate(wallet);
        }
      }}
    >
      {({ errors, isSubmitting }) => (
        <Form>
          <Input name="name" label="Name" error={errors.name} />
          <Input as="select" name="type" label="Type" error={errors.type}>
            <option value={WalletType.Savings}>Savings</option>
            <option value={WalletType.Credit}>Credit Card</option>
          </Input>
          <Input
            type="number"
            name="balance"
            label="Initial Balance"
            inputmode="decimal"
            error={errors.balance}
          />
          <Button type="submit" loading={isSubmitting}>
            Create Wallet
          </Button>
        </Form>
      )}
    </Formik>
  );
}
