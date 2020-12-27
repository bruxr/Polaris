export type DocumentFields = '_id' | '_rev' | '_type';

export interface Document {
  readonly _id: string;
  readonly _rev: string;
  readonly _type: string;
}
