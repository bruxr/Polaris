/* eslint import/namespace: ['error', { allowComputed: true }] */

import React from 'react';
import { render, RenderOptions } from '@testing-library/react';

import db from '../services/db';
import Providers from '../Providers';
import * as factories from './factories';
import { FactoryItem } from '../types/testing';

function customRender(ui: React.ReactElement, options?: RenderOptions): void {
  render(ui, {
    wrapper: Providers,
    ...options,
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any , @typescript-eslint/explicit-module-boundary-types
function build(item: FactoryItem, attributes?: any): any {
  return {
    ...factories[item](),
    ...attributes,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any , @typescript-eslint/explicit-module-boundary-types
async function create<T>(item: FactoryItem, count = 1, attributes?: any): Promise<T[]> {
  const records = [];
  for (let i = 0; i < count; i++) {
    records.push(build(item, attributes));
  }
  const result = await db.bulkDocs(records);

  return records.map((record, index) => ({
    ...record,
    _rev: result[index].rev,
  }));
}

export * from '@testing-library/react';
export {
  customRender as render,
  build,
  create,
};
