import React from 'react';

import * as Yup from 'yup';
import * as Sentry from '@sentry/react';
import { Formik, Form, FormikProps } from 'formik';

import Alert from '../../components/Alert';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useStoreActions } from '../../store';
import auth, { deserializeUser } from '../../services/auth';

type FormValues = {
  email: string;
  password: string;
}

const initialValues: FormValues = {
  email: '',
  password: '',
};

export default function SigninForm(): React.ReactElement {
  const { setCurrentUser } = useStoreActions((actions) => actions);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object({
        email: Yup.string()
          .label('Email')
          .email()
          .required(),
        password: Yup.string()
          .label('Password')
          .required(),
      })}
      onSubmit={async ({ email, password }, { setStatus }) => {
        try {
          const result = await auth.login(email, password, true);
          const user = deserializeUser(result);
          setCurrentUser(user);
        } catch (err) {
          if (err.name === 'JSONHTTPError') {
            setStatus(err.json.error_description);
          } else {
            Sentry.captureException(err);
            setStatus(err.message);
          }
        }
      }}
    >
      {({ status }: FormikProps<FormValues>) => (
        <Form>
          {status && <Alert>{status}</Alert>}

          <Input
            type="email"
            name="email"
            label="Email"
          />
          <Input
            type="password"
            name="password"
            label="Password"
          />
          <Button type="submit">Sign In</Button>
        </Form>
      )}
    </Formik>
  );
}
