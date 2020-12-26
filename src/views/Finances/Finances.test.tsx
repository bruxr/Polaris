import React from 'react';
import { render, screen } from '@testing-library/react';

import Finances from './Finances';

describe('Finances', () => {
  it('renders the component', () => {
    render(<Finances />);
    expect(screen.getByText('Finances')).toBeInTheDocument();
  });
});
