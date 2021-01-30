import { getDb } from './db';
import { DocumentKind } from '../types/db';

/**
 * Utility function for retrieving the first document that matches given params.
 * 
 * @param kind kind of document
 * @param params params
 */
async function findBy<T>(kind: DocumentKind, params: Record<string, string | number>): Promise<T | null> {
  const db = getDb();

  const result = await db.find({
    selector: {
      ...params,
      kind,
    },
  });
  
  if (result.warning) {
    console.warn(result.warning);
  }

  if (result.docs.length === 0) {
    return null;
  }

  return result.docs[0];
}

/**
 * Utility function for retrieving a document with a given ID and document kind.
 *
 * @param id document ID
 * @param kind document kind
 */
async function findById<T>(kind: DocumentKind, id: string): Promise<T | null> {
  return findBy(kind, { _id: id });
}

export {
  findBy,
  findById,
};
