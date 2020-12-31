export type DocumentFields = '_id' | '_rev' | 'kind';

export interface Document {
  readonly _id: string;
  readonly _rev: string;
  readonly kind: string;
}

export interface TransientDocument {
  _id?: string;
  _rev?: string;
}
