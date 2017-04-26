import React from 'react';
import ReactDOM from 'react-dom';
import Meeting from './Meeting';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Meeting />, div);
});
