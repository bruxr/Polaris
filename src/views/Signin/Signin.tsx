import React, { useState } from 'react';

import * as Yup from 'yup';
import { useFormik } from 'formik';
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

  const signinFormik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .label('Email')
        .email()
        .required(),
      password: Yup
        .string()
        .label('Password')
        .required(),
    }),
    onSubmit: async ({ email, password }, { setFieldValue }) => {
      const { data } = await authenticate({ variables: { email, password } });
      if (data.authenticate.errors) {
        setFieldValue('password', '', false);
        setError(data.authenticate.errors[0].message);
        return;
      }

      setStep('otp');
    },
  });

  if (step === 'signin') {
    return (
      <form
        className="flex flex-col items-center justify-center min-w-full min-h-screen"
        onSubmit={signinFormik.handleSubmit}
      >
        {error && <Alert>{error}</Alert>}

        <Input
          id="email"
          type="email"
          name="email"
          label="Email"
          disabled={loading}
          value={signinFormik.values.email}
          error={signinFormik.touched.email ? signinFormik.errors.email : undefined}
          onChange={signinFormik.handleChange}
          onBlur={signinFormik.handleBlur}
        />

        <Input
          id="password"
          type="password"
          name="password"
          label="Password"
          disabled={loading}
          value={signinFormik.values.password}
          error={signinFormik.touched.password ? signinFormik.errors.password : undefined}
          onChange={signinFormik.handleChange}
          onBlur={signinFormik.handleBlur}
        />

        <Button type="submit" disabled={loading}>Sign In</Button>
      </form>
    );
  } else {
    return (
      <form
        className="flex flex-col items-center justify-center min-w-full min-h-screen"
      >
        {error && <Alert>{error}</Alert>}

        <Button type="submit" disabled={loading}>Sign In</Button>
      </form>
    );
  }
}
