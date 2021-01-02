import PouchDB from 'pouchdb-browser';
import PouchDBFind from 'pouchdb-find';
import { DocumentKind } from '../types/db';

PouchDB.plugin(PouchDBFind);

let name = 'polaris';
if (process.env.NODE_ENV !== 'production') {
  name += process.env.NODE_ENV;
}

// We use any here because documents inside the database can be vastly different.
// TODO: Look into properly typing the database based on each doc's "kind" property.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = new PouchDB<any>(name);

async function setupDb(): Promise<void> {
  await db.createIndex({
    index: { fields: ['kind'] },
  });
}

/**
 * Utility function for retrieving the first document that matches given params.
 * 
 * @param kind kind of document
 * @param params params
 */
async function findBy<T>(kind: DocumentKind, params: Record<string, string | number>): Promise<T | null> {
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

export default db;
export {
  setupDb,
  findBy,
  findById,
};
