import React, { useContext, useState, useEffect } from 'react';

import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { loader } from 'graphql.macro';
import { useMutation } from '@apollo/client';

import Alert from '../../components/Alert';
import Input from '../../components/Input';
import Button from '../../components/Button';
import AuthContext from '../../contexts/auth';
import { setAuthToken } from '../../services/apollo';
import { signin, readCredentials } from '../../services/auth';

const AUTHENTICATE = loader('../../graphql/mutations/authenticate.gql');

export default function Signin(): JSX.Element {
  const [error, setError] = useState('');
  const [credentials, setCredentials] = useState<{ email: string, password: string } | undefined>(undefined);

  const authContext = useContext(AuthContext);

  const [authenticate, { loading }] = useMutation(AUTHENTICATE);

  // Try to load any saved credentials
  useEffect(() => {
    const user = readCredentials();
    if (user) {
      setAuthToken(user.token);
      authContext.setUser(user);
    }
  }, [authContext]);

  if (!credentials) {
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
          setError('');
          const { data } = await authenticate({ variables: { email, password } });

          if (data.authenticate.errors) {
            setFieldValue('password', '', false);
            setError(data.authenticate.errors[0].message);
            return;
          }
          setFieldValue('email', '', false);
          setCredentials({ email, password });
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
      <Formik
        initialValues={{ otp: '' }}
        validationSchema={Yup.object({
          otp: Yup
            .string()
            .label('OTP')
            .required(),
        })}
        onSubmit={async ({ otp }, { setFieldValue }) => {
          const { email, password } = credentials;

          setError('');
          const { data } = await authenticate({ variables: { email, password, otp } });

          if (data.authenticate.errors) {
            setFieldValue('otp', '', false);
            setError(data.authenticate.errors[0].message);
            return;
          }

          const { userId, userEmail, token } = data.authenticate;
          const user = {
            id: userId,
            email: userEmail,
            token,
          };
          signin(user);
          authContext.setUser(user);
        }}
      >
        <Form className="flex flex-col items-center justify-center min-w-full min-h-screen">
          {error && <Alert>{error}</Alert>}
          
          <Input
            id="otp"
            name="otp"
            label="OTP"
            placeholder=""
            disabled={loading}
          />

          <Button type="submit" disabled={loading}>Sign In</Button>
        </Form>
      </Formik>
    );
  }
}
