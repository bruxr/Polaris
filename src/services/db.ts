/* eslint @typescript-eslint/no-explicit-any: 0 */
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import PouchDBAuthentication from 'pouchdb-authentication';

import { store } from '../store';

PouchDB.plugin(PouchDBFind);
PouchDB.plugin(PouchDBAuthentication);

const NAME = 'polaris';
let db: PouchDB.Database<any> | null = null;
let remoteDb: PouchDB.Database<any> | null = null;

/**
 * Returns the database instance.
 */
function getDb(): PouchDB.Database<any> { 
  if (db === null) {
    throw new Error('Database not initialized yet.');
  }

  return db;
}

/**
 * Setups a database instance and additional setup depending on `NODE_ENV`.
 * 
 * On test environments, it will create an in-memory instance.
 * Otherwise, it creates a browser database with indices and sync to a remote server.
 */
async function setupDb(): Promise<void> {
  if (db !== null) {
    throw new Error('Database already initialized.');
  }

  if (process.env.NODE_ENV !== 'test') {
    db = new PouchDB<any>(NAME);
    await db.createIndex({
      index: { fields: ['kind'] },
    });
    await setupDbSync();
  } else {
    const PouchDBMemoryAdapter = await import('pouchdb-adapter-memory');
    PouchDB.plugin(PouchDBMemoryAdapter.default);

    db = new PouchDB<any>(NAME, { adapter: 'memory' });
    await db.createIndex({
      index: { fields: ['kind'] },
    });
  }
}

/**
 * Setups DB sync to our backend server.
 */
async function setupDbSync(): Promise<void> {
  if (db === null) {
    throw new Error('Database not initialized.');
  }

  remoteDb = new PouchDB<any>(process.env.REACT_APP_BACKEND_DB, { skip_setup: true });

  try {
    await remoteDb.logIn(
      process.env.REACT_APP_BACKEND_DB_USER || '',
      process.env.REACT_APP_BACKEND_DB_PASS || '',
    );
    db.sync(remoteDb, { live: true })
      .on('paused', () => store.getActions().session.setSyncStatus('inactive'))
      .on('active', () => store.getActions().session.setSyncStatus('active'))
      .on('error', (err) => {
        console.log(err);
        store.getActions().session.setSyncStatus('error');
      });
    store.getActions().session.setSyncStatus('active');
  } catch {
    console.info('Cannot reach backend, sync is disabled.');
  }
}

/**
 * Destroys the current db instance.
 */
async function destroyDb(): Promise<void> {
  if (db === null) {
    throw new Error('Database not initialized.');
  }

  await db.destroy();
  db = null;
}

export {
  getDb,
  setupDb,
  destroyDb,
};
