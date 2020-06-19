import React, { PropsWithChildren } from 'react';

import classnames from 'classnames';

interface Props {
  type?: 'submit' | 'button',
  disabled?: boolean;
  className?: string;
  onClick?: () => void,
}

export default function Button({
  children,
  type,
  disabled,
  className,
  onClick,
}: PropsWithChildren<Props>): JSX.Element {
  return (
    <button
      type={type || 'button'}
      disabled={disabled || false}
      className={classnames(
        'block bg-black w-full p-4 text-white text-sm uppercase tracking-wider',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
