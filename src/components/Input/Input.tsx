import React, { PropsWithChildren } from 'react';

import classnames from 'classnames';
import { Field, useFormikContext } from 'formik';

interface Props {
  name: string;
  label: string;
  error?: string;
  as?: string;
}

export default function Input({ name, label, error, as, children }: PropsWithChildren<Props>): JSX.Element {
  const { isSubmitting } = useFormikContext();

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-gray-700 mb-2">{label}</label>
      <Field
        name={name}
        as={as}
        disabled={isSubmitting}
        className={classnames(
          'block border border-gray-400 p-2 w-full mb-2',
          { 'border-red-600': error }
        )}
      >
        {children}
      </Field>
      {error && <div className="text-red-600 text-xs">{error}</div>}
    </div>
  );
}
