import crypto from 'crypto';
import * as functions from 'firebase-functions';

import { db } from '../services/firebase';

export default functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required.');
  }

  const challenge = crypto.randomBytes(64).toString('base64');
  
  await db.collection('userMeta').doc(context.auth.uid).set({
    authChallenge: challenge,
  }, { merge: true });

  return {
    challenge,
  };
});
