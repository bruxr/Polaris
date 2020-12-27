import classnames from 'classnames';
import React, { PropsWithChildren } from 'react';

import Spinner from '../../components/Spinner';

interface Props {
  type?: 'submit' | 'button' | 'reset',
  variant?: 'primary' | 'secondary' | 'link',
  loading?: boolean;
  className?: string;
  onClick?: () => void,
}

function Button({ type, variant, loading, children, className, onClick }: PropsWithChildren<Props>): JSX.Element {

  return (
    <button
      type={type || 'button'}
      className={classnames(
        'block font-medium text-center w-full p-3',
        {
          'opacity-75': loading,
          'bg-primary text-white': variant === 'primary' || !variant,
          'bg-gray-900 text-white': variant === 'secondary',
          'text-primary': variant === 'link',
        },  
        className,
      )}
      disabled={loading}
      aria-busy={loading}
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
}

export default Button;
