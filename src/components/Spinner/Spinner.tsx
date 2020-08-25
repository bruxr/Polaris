import React from 'react';

import spinner from '../../assets/images/spinner.gif';

export default function Spinner(): JSX.Element {
  return (
    <img src={spinner} alt="Loading..." />
  );
}
