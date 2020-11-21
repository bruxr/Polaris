import React from 'react';

import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { loader } from 'graphql.macro';
import { useMutation } from '@apollo/client';

import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { Wallet, WalletType } from '../../../types/finances';

interface Props {
  wallet?: Wallet;
  onSuccess?: () => void;
}

const CREATE_WALLET = loader('../../../graphql/mutations/CreateWallet.graphql');
const UPDATE_WALLET = loader('../../../graphql/mutations/UpdateWallet.graphql');
const NEW_WALLET_FRAGMENT = loader('../../../graphql/fragments/NewWallet.graphql');

export default function WalletForm({ wallet, onSuccess }: Props): JSX.Element {
  const [createWallet] = useMutation(CREATE_WALLET, {
    update(cache, { data }) {
      cache.modify({
        fields: {
          allWallets(existing = []) {
            const newRef = cache.writeFragment({
              data: data.createWallet,
              fragment: NEW_WALLET_FRAGMENT,
            });
            if (!newRef) {
              throw new Error('Failed to update cache when creating new wallet.');
            }

            return [...existing.data, newRef];
          },
        },
      });
    },
  });
  const [updateWallet] = useMutation(UPDATE_WALLET);

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
      onSubmit={async ({ name, type, balance }) => {
        const variables = {
          name,
          balance: Number(balance) * 100,
          type,
        };
        if (wallet) {
          await updateWallet({
            variables: {
              id: wallet._id,
              ...variables,
            },
          });
        } else {
          await createWallet({ variables });
        }

        if (onSuccess) {
          onSuccess();
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
            {wallet ? 'Update Wallet' : 'Create Wallet'}
          </Button>
        </Form>
      )}
    </Formik>
  );
}
