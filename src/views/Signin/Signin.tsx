import React from 'react';

import * as Yup from 'yup';
import { useFormik } from 'formik';

import Button from '../../components/Button';
import Input from '../../components/Input';

export default function Signin(): JSX.Element {
  const signinFormik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .label('Email')
        .required(),
      password: Yup.string()
        .label('Password')
        .required(),
    }),
    onSubmit: async ({ email, password }) => {
    },
  });

  return (
    <form onSubmit={signinFormik.handleSubmit}>
      <Input
        id="email"
        type="email"
        name="email"
        label="Email"
        value={signinFormik.values.email}
        onChange={signinFormik.handleChange}
      />

      <Input
        id="password"
        type="password"
        name="password"
        label="Password"
        value={signinFormik.values.password}
        onChange={signinFormik.handleChange}
      />

      <Button type="submit">Sign In</Button>
    </form>
  );
}
