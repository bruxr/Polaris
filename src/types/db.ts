export enum DocumentKind {
  Wallet = 'WALLET',
  TransactionCategory = 'TRANSACTION_CATEGORY',
  TransactionMonthStats = 'TRANSACTION_MONTH_STATS',
  Transaction = 'TRANSACTION',
}

export type DocumentFields = '_id' | '_rev' | 'kind';

export interface Document {
  readonly _id: string;
  readonly _rev?: string;
  readonly kind: string;
}

export interface TransientDocument {
  _id?: string;
  _rev?: string;
}
