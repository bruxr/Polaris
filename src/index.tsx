import React from 'react';
import ReactDOM from 'react-dom';

import { RecoilRoot } from 'recoil';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/apm';
import { BrowserRouter as Router } from 'react-router-dom';

import 'typeface-roboto';
import './assets/css/tailwind.out.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './index.css';

import App from './App';
import * as serviceWorker from './serviceWorker';

// Setup sentry on non-dev environments
if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [
      new Integrations.Tracing(),
    ],
    tracesSampleRate: 1.0,
  });
}

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <Router>
        <App />
      </Router>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
