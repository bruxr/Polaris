import React from 'react';
import ReactDOM from 'react-dom';

import * as Sentry from '@sentry/react';

import 'typeface-roboto-mono';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './index.css';

import App from './App';
import Providers from './Providers';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Setup sentry on non-dev environments
if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [
      // new Integrations.Tracing(),
    ],
    tracesSampleRate: 1.0,
  });
}

ReactDOM.render(
  <Providers>
    <App />
  </Providers>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
