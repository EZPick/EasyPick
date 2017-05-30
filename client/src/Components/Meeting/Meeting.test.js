import React from 'react';
import ReactDOM from 'react-dom';
import Meeting from './Meeting';

it('renders without crashing', () => {
  var match = {params: {id: '0'}};
  const div = document.createElement('div');
  ReactDOM.render(<Meeting match={match} />, div);
});
