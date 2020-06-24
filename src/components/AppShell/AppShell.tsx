import React, { PropsWithChildren } from 'react';

import classnames from 'classnames';
import { useRecoilState } from 'recoil';

import Header from './Header';
import Footer from './Footer';
import sheetAtom from '../../atoms/sheet';

export default function AppShell({ children }: PropsWithChildren<unknown>): JSX.Element {
  const [sheet] = useRecoilState(sheetAtom);

  return (
    <main className="bg-black w-screen min-h-screen">
      <div
        className={classnames(
          'bg-white min-h-screen pt-20 px-4 transition-transform duration-100 ease-out',
          { 'transform scale-90': sheet.visible }
        )}
      >
        <Header />
        {children}
        <Footer />
      </div>

      <div id="modals" />
    </main>
  );
}
