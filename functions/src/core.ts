import * as functions from 'firebase-functions';

import { Handler } from './types';

const handle = (...handlers: Handler[]): functions.HttpsFunction => {
  return functions.https.onRequest(async (req, res) => {
    for (const handler of handlers) {
      await handler(req, res);
      if (res.writableEnded) {
        break;
      }
    }
  });
};

export { handle };
