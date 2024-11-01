import { render } from '@testing-library/react';

import Reebok from './reebok';

describe('Reebok', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Reebok />);
    expect(baseElement).toBeTruthy();
  });
});
