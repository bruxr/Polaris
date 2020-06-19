import React, { useState } from 'react';

import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { loader } from 'graphql.macro';
import { useMutation } from '@apollo/client';

import Alert from '../../components/Alert';
import Input from '../../components/Input';
import Button from '../../components/Button';

const AUTHENTICATE = loader('../../graphql/mutations/authenticate.gql');

export default function Signin(): JSX.Element {
  const [error, setError] = useState('');
  const [step, setStep] = useState<'signin' | 'otp'>('signin');

  const [authenticate, { loading }] = useMutation(AUTHENTICATE);

  if (step === 'signin') {
    return (
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={Yup.object({
          email: Yup
            .string()
            .label('Email')
            .email()
            .required(),
          password: Yup
            .string()
            .label('Password')
            .required(),
        })}
        onSubmit={async ({ email, password }, { setFieldValue }) => {
          const { data } = await authenticate({ variables: { email, password } });
          if (data.authenticate.errors) {
            setFieldValue('password', '', false);
            setError(data.authenticate.errors[0].message);
            return;
          }
          setStep('otp');
        }}
      >
        <Form className="flex flex-col items-center justify-center min-w-full min-h-screen">
          {error && <Alert>{error}</Alert>}

          <Input
            id="email"
            type="email"
            name="email"
            label="Email"
            disabled={loading}
          />

          <Input
            id="password"
            type="password"
            name="password"
            label="Password"
            disabled={loading}
          />

          <Button type="submit" disabled={loading}>Sign In</Button>
        </Form>
      </Formik>
    );
  } else {
    return (
      <Form className="flex flex-col items-center justify-center min-w-full min-h-screen">
        {error && <Alert>{error}</Alert>}

        <Button type="submit" disabled={loading}>Sign In</Button>
      </Form>
    );
  }
}
