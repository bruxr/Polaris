import { messaging } from './firebase';
import { deleteFcmToken, saveFcmToken } from '../db/users';

const storeToken = async (token: string): Promise<void> => {
  localStorage.setItem('fcmToken', token);
  await saveFcmToken(token);
};

/**
 * Setups and connects to Firebase cloud messaging.
 */
export const setupMessaging = async (): Promise<void> => {
  messaging.usePublicVapidKey(process.env.REACT_APP_FIREBASE_VAPID_KEY || '');

  // Update our saved token if our token refreshes
  messaging.onTokenRefresh((token) => {
    const currentToken = localStorage.getItem('fcmToken');
    if (currentToken) {
      deleteFcmToken(currentToken);
    }
    storeToken(token);
  });

  // Reuse stored tokens if present otherwise generate and save to DB
  const savedToken = localStorage.getItem('fcmToken');
  if (!savedToken) {
    console.info('No token stored on device, retrieving a new one.');
    const token = await messaging.getToken();
    localStorage.setItem('fcmToken', token);
    saveFcmToken(token);
  } else {
    console.info('Reusing token stored on device.');
    saveFcmToken(savedToken);
  }
};
