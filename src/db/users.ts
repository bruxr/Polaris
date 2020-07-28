import { firestore, db } from '../services/firebase';

/**
 * Deletes the provided FCM token.
 */
export const deleteFcmToken = async (token: string): Promise<void> => {
  const snapshot = await db.collection('tokens').where('token', '==', token).get();
  if (snapshot.size === 0) {
    return;
  }

  const batch = db.batch();
  snapshot.forEach((doc) => batch.delete(db.collection('tokens').doc(doc.id)));
  await batch.commit();
};

/**
 * Saves the provided FCM token to DB and local storage.
 * 
 * @param token FCM token
 */
export const saveFcmToken = async (token: string): Promise<void> => {
  const snapshot = await db.collection('tokens').where('token', '==', token).get();
  if (snapshot.size > 0) {
    return;
  }

  await db.collection('tokens').add({
    token,
    ts: firestore.FieldValue.serverTimestamp(),
  });
};
