import React, { useEffect, useState } from 'react';

import * as Yup from 'yup';
import * as Sentry from '@sentry/react';
import { Formik, Form } from 'formik';

import Alert from '../../components/Alert';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Select from '../../components/Select';
import { putWallet } from '../../db/wallets';
import { Wallet, WalletType } from '../../types/finances';
import { getLastTransaction } from '../../db/transactions';

interface Props {
  wallet?: Wallet;
  onSuccess?: () => void;
}

export default function WalletForm({ wallet, onSuccess }: Props): JSX.Element {
  const [balance, setBalance] = useState(0);
  useEffect(() => {
    if (!wallet) {
      return;
    }

    getLastTransaction(wallet).then((tx) => {
      setBalance(tx.balance / 100);
    });
  }, [wallet]);

  return (
    <Formik
      initialValues={{
        name: wallet ? wallet.name : '',
        type: wallet ? wallet.type : WalletType.Savings,
        balance,
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
      onSubmit={async ({ name, type, balance }, { setStatus }) => {
        try {
          await putWallet({
            ...wallet,
            name,
            type,
            createdAt: wallet ? wallet.createdAt : new Date(),
          }, balance * 100);
        } catch (err) {
          Sentry.captureException(err);
          setStatus(err.message);
        }

        if (onSuccess) {
          onSuccess();
        }
      }}
      enableReinitialize
    >
      {({ errors, status, isSubmitting }) => (
        <Form>
          {status && <Alert>{status}</Alert>}

          <Input name="name" label="Name" />
          <Select
            name="type"
            label="Type"
            options={[
              { value: WalletType.Savings, label: 'Savings' },
              { value: WalletType.Credit, label: 'Credit Card' },
            ]}
          />
          <Input
            type="number"
            name="balance"
            label="Initial Balance"
            inputMode="decimal"
            error={errors.balance}
          />
          <Button type="submit" loading={isSubmitting}>
            Save
          </Button>
        </Form>
      )}
    </Formik>
  );
}
