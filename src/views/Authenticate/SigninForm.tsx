import React from 'react';

import * as Yup from 'yup';
import { useSetRecoilState } from 'recoil';
import { Formik, Form, FormikProps } from 'formik';

import Alert from '../../components/Alert';
import Input from '../../components/Input';
import { login } from '../../services/auth';
import Button from '../../components/Button';
import currentUserAtom from '../../atoms/current-user';

type FormValues = {
  email: string;
  password: string;
}

const initialValues: FormValues = {
  email: '',
  password: '',
};

export default function SigninForm(): React.ReactElement {
  const setCurrentUser = useSetRecoilState(currentUserAtom);

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
          setStatus(null);
          await login(email, password);
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
          <Button type="submit">Sign In</Button>
        </Form>
      )}
    </Formik>
  );
}
