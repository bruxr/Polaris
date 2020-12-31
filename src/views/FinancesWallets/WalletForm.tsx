import React from 'react';

import * as Yup from 'yup';
import { Formik, Form } from 'formik';

import Alert from '../../components/Alert';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Select from '../../components/Select';
import { putWallet } from '../../db/finances';
import { Wallet, WalletType } from '../../types/finances';

interface Props {
  wallet?: Wallet;
  onSuccess?: () => void;
}

export default function WalletForm({ wallet, onSuccess }: Props): JSX.Element {

  return (
    <Formik
      initialValues={{
        name: wallet ? wallet.name : '',
        type: wallet ? wallet.type : WalletType.Savings,
        balance: wallet ? wallet.balance / 100 : 0,
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
        const data = {
          name,
          balance: Number(balance) * 100,
          type,
        };
        try {
          await putWallet({
            ...wallet,
            ...data,
            createdOn: wallet ? wallet.createdOn : new Date(),
          });
        } catch (err) {
          setStatus(err.message);
        }

        if (onSuccess) {
          onSuccess();
        }
      }}
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
