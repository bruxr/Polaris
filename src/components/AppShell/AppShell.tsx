import React, { PropsWithChildren } from 'react';

import Header from './Header';

export default function AppShell({ children }: PropsWithChildren<unknown>): JSX.Element {
  return (
    <main className="pt-20">
      <Header />
      {children}
    </main>
  );
}
