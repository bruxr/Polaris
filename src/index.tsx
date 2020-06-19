import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import './index.css';
import 'react-toastify/dist/ReactToastify.css';
// eslint-disable-next-line import/no-unresolved
import './assets/css/tailwind-out.css';

import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
