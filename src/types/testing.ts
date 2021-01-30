export enum FactoryItem {
  Wallet = 'wallet',
  Transaction = 'transaction',
  TransactionCategory = 'transactionCategory',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FactoryBuilder = (factory: FactoryItem, attributes: any) => any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FactoryCreator = (factory: FactoryItem, count: number, attributes?: any) => Promise<T[]>;

export type Factory<T> = (args: { create: FactoryCreator, build: FactoryBuilder })
  => Omit<T, '_id' | '_rev'> & { _id?: string };
