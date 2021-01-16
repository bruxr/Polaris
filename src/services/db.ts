import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import { DocumentKind } from '../types/db';
import PouchDBMemoryAdapter from 'pouchdb-adapter-memory';
import PouchDBAuthentication from 'pouchdb-authentication';

PouchDB.plugin(PouchDBFind);
PouchDB.plugin(PouchDBMemoryAdapter);
PouchDB.plugin(PouchDBAuthentication);

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
  await setupDbSync();
}

/**
 * Setups DB sync to our backend server.
 */
async function setupDbSync(): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const remoteDb = new PouchDB<any>(process.env.REACT_APP_BACKEND_DB, { skip_setup: true });

  try {
    await remoteDb.logIn(
      process.env.REACT_APP_BACKEND_DB_USER || '',
      process.env.REACT_APP_BACKEND_DB_PASS || '',
    );
    db.sync(remoteDb, { live: true })
      // .on('paused', () => console.info('Sync paused'))
      // .on('active', () => console.info('Sync active.'))
      .on('error', (err) => console.error(`Sync error: ${err}`));
  } catch {
    console.info('Cannot reach backend, sync is disabled.');
  }
}

/**
 * Setups a database instance to be used for testing.
 */
async function resetTestDb(): Promise<void> {
  await db.destroy();
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
  resetTestDb,
  findBy,
  findById,
};
