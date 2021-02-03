export enum FactoryItem {
  Wallet = 'wallet',
  Transaction = 'transaction',
  TransactionCategory = 'transactionCategory',
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FactoryBuilder = (factory: FactoryItem, attributes?: any) => Promise<any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FactoryCreator = <T = unknown>(factory: FactoryItem, count?: number, attributes?: any) => Promise<T[]>;

type Attributes = Record<string, string | number | boolean | Record<string, string | number>>;
export type Factory = (args: { create: FactoryCreator, build: FactoryBuilder })
  => Attributes | Promise<Attributes>;
