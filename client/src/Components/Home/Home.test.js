import React from 'react';
import ReactDOM from 'react-dom';
import Home from './Home';
import { MemoryRouter, Route } from 'react-router';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    (<MemoryRouter initialEntries={[ '/' ]}>
      <Route path="/" component={Home} />
    </MemoryRouter>),
  div);
});
