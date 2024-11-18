import { render } from '@testing-library/react';

import Page from '../src/app/page';
import React from 'react';

describe('Page', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Page />);
    expect(baseElement).toBeTruthy();
  });
});
