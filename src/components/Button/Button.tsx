import React, { PropsWithChildren } from 'react';

import classnames from 'classnames';

interface Props {
  type?: 'submit' | 'button',
  className?: string;
  onClick?: () => void,
}

export default function Button({ children, type, className, onClick }: PropsWithChildren<Props>): JSX.Element {
  return (
    <button
      type={type || 'button'}
      onClick={onClick}
      className={classnames(
        'block bg-black w-full p-4 text-white text-sm uppercase tracking-wider',
        className,
      )}
    >
      {children}
    </button>
  );
}
