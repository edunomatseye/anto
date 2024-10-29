import { render } from '@testing-library/react';

import Inven from './inven';

describe('Inven', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Inven />);
    expect(baseElement).toBeTruthy();
  });
});
