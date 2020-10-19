import React, { PropsWithChildren } from 'react';

import classnames from 'classnames';
import { Field, useFormikContext, FieldAttributes } from 'formik';

type Props = FieldAttributes<Record<string ,unknown>> & {
  name: string;
  label: string;
  error?: string;
  as?: string;
  maxLength?: number;
}

const Input = (props: PropsWithChildren<Props>): JSX.Element => {
  const { type, name, label, error, as, maxLength, children } = props;
  const { isSubmitting } = useFormikContext();

  return (
    <div className={classnames('mb-4', { 'flex justify-between': type === 'checkbox' })}>
      <label htmlFor={name} className="block text-gray-700 mb-2">{label}</label>
      <Field
        {...props}
        type={type}
        name={name}
        as={as}
        disabled={isSubmitting}
        className={classnames(
          'block border border-gray-700 p-2 mb-2 bg-gray-900',
          {
            'border-red-600': error,
            'w-full': type !== 'checkbox',
          },
        )}
        maxLength={maxLength}
      >
        {children}
      </Field>
      {error && <div className="text-red-600 text-xs">{error}</div>}
    </div>
  );
};

export default Input;
