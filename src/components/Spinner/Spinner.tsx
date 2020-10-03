import React from 'react';

import styles from './Spinner.module.scss';

export default function Spinner(): JSX.Element {
  return (
    <div className={styles.spinner} role="alert" aria-busy />
  );
}
