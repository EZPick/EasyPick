import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter, Route } from 'react-router';
import Respond from './Respond';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    (<MemoryRouter initialEntries={[ '/respond/1' ]}>
      <Route path="respond/:id" component={Respond} />
    </MemoryRouter>),
  div);
});
