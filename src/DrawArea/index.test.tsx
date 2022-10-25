import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import DrawArea from './index';

describe('<DrawArea />', () => {
  it('render DrawArea with dumi', () => {
    const msg = 'dumi';

    render(
      <DrawArea innerId="stage">
        <div id="stage" style={{ height: '500px', width: '500px', border: '1px solid #000' }}></div>
      </DrawArea>,
    );
    expect(screen.queryByText(msg)).toBeInTheDocument();
  });
});
