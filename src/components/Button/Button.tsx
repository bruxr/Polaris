import React, { PropsWithChildren, useMemo } from 'react';
import classnames from 'classnames';
import { useFormikContext } from 'formik';
import isUndefined from 'lodash-es/isUndefined';

import Spinner from '../../components/Spinner';

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
        'block font-medium text-center w-full p-3',
        {
          'opacity-50': isLoading,
        },
      )}
      disabled={isLoading}
      aria-busy={isLoading}
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
}
