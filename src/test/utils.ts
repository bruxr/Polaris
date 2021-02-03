/* eslint import/namespace: ['error', { allowComputed: true }] */

import React from 'react';
import { render, RenderOptions } from '@testing-library/react';

import Providers from '../Providers';
import { getDb } from '../services/db';
import * as factories from './factories';
import { FactoryBuilder, FactoryCreator } from '../types/testing';

function customRender(ui: React.ReactElement, options?: RenderOptions): void {
  render(ui, {
    wrapper: Providers,
    ...options,
  });
}

/**
 * Generates attributes from a factory.
 *
 * @param factory factory name
 * @param attributes optional attributes to override factory
 */
const build: FactoryBuilder = async (factory, attributes = {}) => {
  const attrs = await factories[factory]({ create, build });
  return {
    ...attrs,
    ...attributes,
  };
};

/**
 * Creates records from a factory.
 *
 * @param factory factory name
 * @param count number of records to create
 * @param attributes optional attributes to override factory
 */
const create: FactoryCreator = async (factory, count = 1, attributes = {}) => {
  const db = getDb();
  
  const records = [];
  for (let i = 0; i < count; i++) {
    const attrs = await build(factory, attributes);
    records.push(attrs);
  }
  const result = await db.bulkDocs(records);

  return records.map((record, index) => ({
    ...record,
    _rev: result[index].rev,
  }));
};

export * from '@testing-library/react';
export {
  customRender as render,
  build,
  create,
};
