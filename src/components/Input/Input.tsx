import React, { DetailedHTMLProps, InputHTMLAttributes } from 'react';

import classnames from 'classnames';

interface Props extends DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> {
  label: string;
  id: string;
  error?: string;
}

export default function Input(props: Props): JSX.Element {
  const { label, id, error } = props;

  return (
    <div className="min-w-full mb-4">
      <label
        className="block mb-2"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        placeholder={label}
        {...props}
        id={id}
        className={classnames(
          'p-2 w-full border border-gray text-base',
          props.className,
          { 'border-red': !!error }
        )}
      />
      {error && (
        <div className="mt-2 text-red text-xs">
          {error}
        </div>
      )}
    </div>
  );
}
