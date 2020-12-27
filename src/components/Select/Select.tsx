import classnames from 'classnames';
import React, { useMemo } from 'react';
import { Field, useFormikContext } from 'formik';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDownSharp';

import Label from '../Label';

type Props = {
  label: string,
  name: string,
  options: Array<{ label: string, value: string }>,
}

function Select({ label, name, options }: Props): React.ReactElement { 
  // We allow any here since we cannot fully determine the form values.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formik = useFormikContext<any>();

  const selectedLabel = useMemo(() => {
    const selected = formik.values[name];
    const option = options.find((option) => option.value === selected);
    if (!option) {
      throw new Error(`Cannot find option with value ${selected}`);
    }

    return option.label;
  }, [formik.values, name, options]);
  const hasError = useMemo(() => {
    return !!formik.errors[name];
  }, [formik.errors, name]);

  return (
    <div className="mb-4">
      <Label htmlFor={name}>{label}</Label>
      <div
        className={classnames(
          'flex relative h-7 border-b pb-2',
          hasError ? 'border-red' : 'border-gray-500',
        )}
      >
        <Field
          name={name}
          id={name}
          as="select"
          className="w-full absolute inset-0 opacity-0 z-10"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </Field>
        <span className={classnames('flex-1', hasError ? 'text-red' : 'text-white')}>{selectedLabel}</span>
        <ArrowDropDownIcon className={hasError ? 'text-red' : 'text-gray-500'} />
      </div>
      {hasError && <span className="inline-block mt-3 text-red text-xs">{formik.errors[name]}</span>}
    </div>
  );
}

export default Select;
