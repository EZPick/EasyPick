import React from 'react';
import ReactDOM from 'react-dom';
import Respond from './Respond';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Respond />, div);
});
