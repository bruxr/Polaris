import React, { PropsWithChildren } from 'react';

import Sentry from '@sentry/react';
import { StoreProvider } from 'easy-peasy';
import { BrowserRouter as Router } from 'react-router-dom';

import { store } from './store';

type Props = {
}

function Providers({ children }: PropsWithChildren<Props>): React.ReactElement {
  return (
    <React.StrictMode>
      <Sentry.ErrorBoundary fallback="An error has occured.">
        <StoreProvider store={store}>
          <Router>
            {children}
          </Router>
        </StoreProvider>
      </Sentry.ErrorBoundary>
    </React.StrictMode>
  );
}

export default Providers;
