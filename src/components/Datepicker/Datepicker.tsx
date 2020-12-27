import classnames from 'classnames';
import format from 'date-fns/format';
import isToday from 'date-fns/isToday';
import React, { useMemo } from 'react';
import parseISO from 'date-fns/parseISO';
import isYesterday from 'date-fns/isYesterday';
import { Field, useFormikContext } from 'formik';

import Label from '../Label';

type Props = {
  label: string,
  name: string,
}

function Datepicker({ label, name }: Props): React.ReactElement { 
  // We allow any here since we cannot fully determine the form values.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formik = useFormikContext<any>();

  const date = useMemo(() => {
    const value = parseISO(formik.values[name]);
    if (isToday(value)) {
      return 'Today';
    } else if (isYesterday(value)) {
      return 'Yesterday';
    } else {
      return format(value, 'MMM d');
    }
  }, [formik.values, name]);

  const hasError = useMemo(() => {
    return !!formik.errors[name];
  }, [formik.errors, name]);

  return (
    <div className="mb-4">
      <Label htmlFor={name}>{label}</Label>
      <div
        className={classnames(
          'flex relative h-7 border-b pb-2',
          hasError ? 'border-red text-red' : 'border-gray-500 text-white',
        )}
      >
        <Field
          name={name}
          id={name}
          type="date"
          className="w-full absolute inset-0 opacity-0 z-10"
        />
        {date}
      </div>
      {hasError && <span className="inline-block mt-3 text-red text-xs">{formik.errors[name]}</span>}
    </div>
  );
}

export default Datepicker;
