import React, { PropsWithChildren } from 'react';

import classnames from 'classnames';

interface Props {
  type?: 'submit' | 'button',
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: () => void,
}

export default function Button({
  children,
  type,
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
        'block bg-black w-full p-4 text-white text-sm uppercase tracking-wider',
        { 'opacity-25': loading },
        className,
      )}
      onClick={onClick}
    >
      {loading ? 'Please wait...' : children}
    </button>
  );
}
