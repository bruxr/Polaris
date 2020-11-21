import React from 'react';

import * as Yup from 'yup';
import { useSetRecoilState } from 'recoil';
import { Formik, Form, FormikProps } from 'formik';

import { User } from '../../types/users';
import Alert from '../../components/Alert';
import Input from '../../components/Input';
import Button from '../../components/Button';
import currentUserAtom from '../../atoms/current-user';
import auth, { registerTouchId } from '../../services/auth';

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
        let user: User | undefined;
        try {
          const result = await auth.login(email, password, true);
          console.log(result);
          user = {
            id: result.id,
            name: result.user_metadata.full_name,
            email: result.email,
            token: result.token.access_token,
          };
        } catch (err) {
          if (err.name === 'JSONHTTPError') {
            setStatus(err.json.error_description);
          } else {
            setStatus(err.message);
          }
        }

        if (user) {
          setCurrentUser(user);
          await registerTouchId(user);
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
