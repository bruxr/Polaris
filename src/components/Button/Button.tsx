import React, { PropsWithChildren, useMemo } from 'react';
import classnames from 'classnames';
import { useFormikContext } from 'formik';
import isUndefined from 'lodash-es/isUndefined';

interface Props {
  type?: 'submit' | 'button' | 'reset',
  loading?: boolean;
  onClick?: () => void,
}

export default function Button({ type, loading, children, onClick }: PropsWithChildren<Props>): JSX.Element {
  const formik = useFormikContext();

  const isLoading = useMemo(() => {
    if (isUndefined(loading) && !isUndefined(formik)) {
      return formik.isSubmitting;
    }

    return loading;
  }, [loading, formik]);

  return (
    <button
      type={type || 'button'}
      className={classnames(
        'block text-center tracking-wider uppercase w-full p-3',
        { 'bg-gray-200 text-gray-700': isLoading, 'bg-gray-900 text-white': !isLoading },
      )}
      disabled={isLoading}
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
    >
      {isLoading ? 'Please Wait' : children}
    </button>
  );
}
