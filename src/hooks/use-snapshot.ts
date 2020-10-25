import { firestore } from 'firebase';
import { useEffect, useState } from 'react';

/**
 * Fetches records from Firestore and watches for any changes.
 * Automatically removes watcher when the component unloads.
 * 
 * @param query firestore query
 * @param deserialize function that converts document data to a usable object
 */
export default function useSnapshot<T>(
  query: firestore.Query,
  deserialize: (id: string, data: firestore.DocumentData) => T,
): T[] | null {
  const [records, setRecords] = useState<T[] | null>(null);

  useEffect(() => {
    const unsubscribe = query.onSnapshot((snapshot) => {
      const records: T[] = [];
      snapshot.forEach((doc) => {
        records.push(deserialize(doc.id, doc.data()));
      });
      setRecords(records);
    });

    return () => unsubscribe();

  // Disabling linting here because query always changes for some reason.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deserialize]);

  return records;
}
