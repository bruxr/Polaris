import React, { DetailedHTMLProps, InputHTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> {
  label: string;
  id: string;
}

export default function Input(props: Props): JSX.Element {
  const { label, id } = props;

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        placeholder={label}
        {...props}
        id={id}
      />
    </div>
  );
}
