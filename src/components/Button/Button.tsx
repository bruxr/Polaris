import React, { PropsWithChildren } from 'react';

import classnames from 'classnames';

interface Props {
  type?: 'submit' | 'button' | 'reset',
  loading?: boolean;
  onClick?: () => void,
}

export default function Button({ type, loading, children, onClick }: PropsWithChildren<Props>): JSX.Element {
  return (
    <button
      type={type || 'button'}
      className={classnames(
        'block text-center tracking-wider uppercase w-full p-3',
        { 'bg-gray-200 text-gray-700': loading, 'bg-gray-900 text-white': !loading },
      )}
      disabled={loading}
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
    >
      {loading ? 'Please Wait' : children}
    </button>
  );
}
