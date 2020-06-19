import React, { PropsWithChildren } from 'react';

export default function Alert({ children }: PropsWithChildren<unknown>): JSX.Element {
  return (
    <div className="bg-red-100 border-red-600 text-red-600 mb-4 p-4 w-full">
      {children}
    </div>
  );
}
