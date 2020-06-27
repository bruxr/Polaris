import React, { PropsWithChildren } from 'react';

import classnames from 'classnames';

interface Props {
  type?: 'submit' | 'button',
  variant?: 'primary' | 'danger',
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: () => void,
}

export default function Button({
  children,
  type,
  variant,
  disabled,
  loading,
  className,
  onClick,
}: PropsWithChildren<Props>): JSX.Element {
  return (
    <button
      type={type || 'button'}
      disabled={disabled || loading || false}
      className={classnames(
        'block w-full p-4 text-white text-sm uppercase tracking-wider',
        { 'opacity-25': loading },
        {
          'bg-black': !variant || variant === 'primary',
          'text-red-700': variant === 'danger',
        },
        className,
      )}
      onClick={onClick}
    >
      {loading ? 'Please wait...' : children}
    </button>
  );
}
