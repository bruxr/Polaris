import { firestore } from 'firebase';

export type Deserializer<T> = (id: string, data: firestore.DocumentData) => T;

export interface FaunaRecord {
  _id: string;
  _ts: number;
}
