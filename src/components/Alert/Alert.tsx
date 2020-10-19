import React, { PropsWithChildren } from 'react';

export default function Alert({ children }: PropsWithChildren<unknown>): JSX.Element {
  return (
    <div className="border-red text-red mb-4 p-4 w-full">
      {children}
    </div>
  );
}
