import React from 'react';
import ReactDOM from 'react-dom';
import Location from './Location';
import ReactTestUtils from 'react-dom/test-utils';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Location />, div);
});
