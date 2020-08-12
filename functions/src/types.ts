import * as functions from 'firebase-functions';

export type Handler = (request: functions.https.Request, response: functions.Response) => void | Promise<void>;
