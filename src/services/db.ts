import PouchDB from 'pouchdb-browser';

let name = 'polaris';
if (process.env.NODE_ENV === 'development') {
  name += '-dev';
}

const db = new PouchDB(name);

export default db;
