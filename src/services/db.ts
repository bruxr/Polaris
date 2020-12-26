import PouchDB from 'pouchdb-browser';
import PouchDBFind from 'pouchdb-find';

PouchDB.plugin(PouchDBFind);

let name = 'polaris';
if (process.env.NODE_ENV === 'development') {
  name += '-dev';
}

const db = new PouchDB(name);

async function setupDb(): Promise<void> {
  await db.createIndex({
    index: { fields: ['_type'] },
  });
}

export default db;
export {
  setupDb,
};
