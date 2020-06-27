import React, { DetailedHTMLProps, InputHTMLAttributes, useMemo } from 'react';

import classnames from 'classnames';
import { Field, useFormikContext } from 'formik';

interface Props extends DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> {
  name: string;
  label: string;
  id: string;
  error?: string;
  as?: 'input' | 'select';
}

export default function Input(props: Props): JSX.Element {
  const { name, label, id, error, as } = props;
  const { touched, errors } = useFormikContext<{[index: string]: string}>();

  // Determine if there is an error message to be displayed.
  // If an error is explicitly provided via props, use it.
  const errorMsg = useMemo(() => {
    if (error) {
      return error;
    }

    return touched[name] && errors[name] ? errors[name] : undefined;
  }, [error, name, touched, errors]);

  return (
    <div className="min-w-full mb-4">
      <label
        className="block mb-2"
        htmlFor={id}
      >
        {label}
      </label>
      <Field
        placeholder={label}
        {...props}
        as={as}
        id={id}
        className={classnames(
          'p-2 w-full border border-gray text-base',
          props.className,
          { 'border-red-600': !!errorMsg }
        )}
      />
      {errorMsg && (
        <div className="mt-2 text-red-600 text-xs">
          {errorMsg}
        </div>
      )}
    </div>
  );
}
