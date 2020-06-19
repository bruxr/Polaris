import React, { PropsWithChildren } from 'react';

interface Props {
  type?: 'submit' | 'button',
  onClick?: () => void,
}

export default function Button({ children, type, onClick }: PropsWithChildren<Props>): JSX.Element {
  return (
    <button
      type={type || 'button'}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
