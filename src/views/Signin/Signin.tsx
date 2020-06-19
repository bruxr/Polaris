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
        .email()
        .required(),
      password: Yup.string()
        .label('Password')
        .required(),
    }),
    onSubmit: async ({ email, password }) => {
    },
  });

  return (
    <form
      className="flex flex-col items-center justify-center min-w-full min-h-screen"
      onSubmit={signinFormik.handleSubmit}
    >
      <Input
        id="email"
        type="email"
        name="email"
        label="Email"
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
        value={signinFormik.values.password}
        error={signinFormik.touched.password ? signinFormik.errors.password : undefined}
        onChange={signinFormik.handleChange}
        onBlur={signinFormik.handleBlur}
      />

      <Button type="submit">Sign In</Button>
    </form>
  );
}
