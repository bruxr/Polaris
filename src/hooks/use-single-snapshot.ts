import { firestore } from 'firebase';
import { useEffect, useState } from 'react';

/**
 * Fetches a record from Firestore and watches for any changes.
 * Automatically removes watcher when the component unloads.
 * 
 * @param query firestore reference
 * @param deserialize function that converts document data to a usable object
 */
export default function useSnapshot<T>(
  query: firestore.DocumentReference,
  deserialize: (id: string, data: firestore.DocumentData) => T,
): T | null {
  const [record, setRecord] = useState<T | null>(null);

  useEffect(() => {
    const unsubscribe = query.onSnapshot((snapshot) => {
      const data = snapshot.data();
      if (data) {
        setRecord(deserialize(snapshot.id, data));
      }
    });

    return () => unsubscribe();

  // Disabling linting here because query always changes for some reason.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deserialize]);

  return record;
}
