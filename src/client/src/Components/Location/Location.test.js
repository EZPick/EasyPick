import React from 'react';
import ReactDOM from 'react-dom';
import Location from './Location';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Location />, div);
});
