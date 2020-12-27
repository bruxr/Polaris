import React, { PropsWithChildren } from 'react';

type Props = {
  htmlFor: string;
}

function Label({ htmlFor, children }: PropsWithChildren<Props>): React.ReactElement {
  return (
    <label htmlFor={htmlFor} className="text-gray-500 text-sm mb-2 block">{children}</label>
  );
}

export default Label;
