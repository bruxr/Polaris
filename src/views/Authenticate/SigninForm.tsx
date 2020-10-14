import React from 'react';

import * as Yup from 'yup';
import { Formik, Form, FormikProps } from 'formik';

import Alert from '../../components/Alert';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { auth } from '../../services/firebase';

type FormValues = {
  email: string;
  password: string;
}

const initialValues: FormValues = {
  email: '',
  password: '',
};

export default function SigninForm(): React.ReactElement {
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
          await auth.signInWithEmailAndPassword(email, password);
        } catch (err) {
          if (err.code === 'auth/user-not-found') {
            setStatus(err.message);
          } else {
            throw err;
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
