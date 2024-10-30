import { render } from '@testing-library/react';

import Ship from './ship';

describe('Ship', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Ship />);
    expect(baseElement).toBeTruthy();
  });
});
