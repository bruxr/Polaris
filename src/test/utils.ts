import React from 'react';
import { render, RenderOptions } from '@testing-library/react';

import Providers from '../Providers';

function customRender(ui: React.ReactElement, options?: RenderOptions): void {
  render(ui, {
    wrapper: Providers,
    ...options,
  });
}

export * from '@testing-library/react';
export { customRender as render };
