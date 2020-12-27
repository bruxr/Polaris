import React, { useMemo, PropsWithChildren } from 'react';

import classnames from 'classnames';
import { Field, useFormikContext, FieldAttributes } from 'formik';

import Label from '../Label';

type Props = FieldAttributes<Record<string ,unknown>> & {
  name: string;
  label: string;
}

function Input(props: PropsWithChildren<Props>): React.ReactElement {
  const { name, label } = props;

  // We allow any here since we cannot fully determine the form values.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { errors, isSubmitting } = useFormikContext<any>();

  const hasError = useMemo(() => {
    return !!errors[name];
  }, [errors, name]);

  return (
    <div className="mb-4">
      <Label htmlFor={name}>{label}</Label>
      <div
        className={classnames(
          'border-b pb-2',
          hasError ? 'border-red text-red' : 'border-gray-500 text-white',
        )}
      >
        <Field
          {...props}
          name={name}
          disabled={isSubmitting}
          className={classnames(
            'bg-transparent w-full',
            hasError ? 'text-red' : 'text-white',
          )}
        />
      </div>
      {hasError && <div className="text-red-600 text-xs">{errors[name]}</div>}
    </div>
  );
}

export default Input;
