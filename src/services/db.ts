import PouchDB from 'pouchdb-browser';
import PouchDBFind from 'pouchdb-find';

PouchDB.plugin(PouchDBFind);

let name = 'polaris';
if (process.env.NODE_ENV === 'development') {
  name += '-dev';
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

export default db;
export {
  setupDb,
};
