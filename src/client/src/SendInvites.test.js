import React from 'react';
import ReactDOM from 'react-dom';
import SendInvites from './SendInvites';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SendInvites />, div);
});
