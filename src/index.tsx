import React from 'react';
import ReactDOM from 'react-dom';

import { RecoilRoot } from 'recoil';
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter as Router } from 'react-router-dom';

import './assets/css/tailwind.out.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './index.css';

import App from './App';
import * as serviceWorker from './serviceWorker';
import NotificationsManager from './components/NotificationsManager';

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN || ''}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID || ''}
      redirectUri={window.location.origin}
    >
      <RecoilRoot>
        <Router>
          <NotificationsManager>
            <App />
          </NotificationsManager>
        </Router>
      </RecoilRoot>
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
