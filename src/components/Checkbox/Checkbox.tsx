import React from 'react';
import { Field, useFormikContext } from 'formik';
import CheckBoxIcon from '@material-ui/icons/CheckBoxSharp';
import CheckBoxOutlineIcon from '@material-ui/icons/CheckBoxOutlineBlankSharp';

import Label from '../Label';

type Props = {
  label: string;
  name: string;
}

function Checkbox({ label, name }: Props): React.ReactElement {
  // We allow any here since we cannot fully determine the form values.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { values } = useFormikContext<any>();

  return (
    <div className="flex items-center justify-between mt-6 mb-4">
      <Label htmlFor={name}>{label}</Label>
      <div className="relative">
        <Field
          type="checkbox"
          name={name}
          className="absolute w-full h-full z-10 opacity-0"
        />
        {values[name]
          ? <CheckBoxIcon className="text-primary" />
          : <CheckBoxOutlineIcon className="text-gray-500" />}
      </div>
    </div>
  );
}

export default Checkbox;
