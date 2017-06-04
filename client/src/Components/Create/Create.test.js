import React from 'react';
import ReactDOM from 'react-dom';
import Create from './Create';
import { MemoryRouter, Route } from 'react-router';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    (<MemoryRouter initialEntries={[ '/create' ]}>
      <Route path="/create" component={Create} />
    </MemoryRouter>),
  div);
});
