import React from 'react';

import * as Yup from 'yup';
import { Formik, Form, FormikProps } from 'formik';

import Alert from '../../components/Alert';
import Input from '../../components/Input';
import Button from '../../components/Button';

type FormValues = {
  email: string;
  password: string;
  confirmPassword: string;
}

const initialValues: FormValues = {
  email: '',
  password: '',
  confirmPassword: '',
};

export default function SignupForm(): React.ReactElement {
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
        confirmPassword: Yup.string()
          .label('Confirm Password')
          .required()
          .oneOf([Yup.ref('password'), ''], 'Passwords must match'),
      })}
      onSubmit={async (values, { setStatus }) => {
        try {
          // await auth.createUserWithEmailAndPassword(email, password);
        } catch (err) {
          setStatus(err.message);
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
          <Input
            type="password"
            name="confirmPassword"
            label="Confirm Password"
          />
          <Button type="submit">Sign Up</Button>
        </Form>
      )}
    </Formik>
  );
}
