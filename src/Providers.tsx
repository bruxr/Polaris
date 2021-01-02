import React, { PropsWithChildren } from 'react';
import { RecoilRoot } from 'recoil';
import { BrowserRouter as Router } from 'react-router-dom';

type Props = {
}

function Providers({ children }: PropsWithChildren<Props>): React.ReactElement {
  return (
    <React.StrictMode>
      <RecoilRoot>
        <Router>
          {children}
        </Router>
      </RecoilRoot>
    </React.StrictMode>
  );
}

export default Providers;
