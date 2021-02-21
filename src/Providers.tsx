import React, { PropsWithChildren } from 'react';
import { StoreProvider } from 'easy-peasy';
import { BrowserRouter as Router } from 'react-router-dom';

import { store } from './store';

type Props = {
}

function Providers({ children }: PropsWithChildren<Props>): React.ReactElement {
  return (
    <React.StrictMode>
      <StoreProvider store={store}>
        <Router>
          {children}
        </Router>
      </StoreProvider>
    </React.StrictMode>
  );
}

export default Providers;
