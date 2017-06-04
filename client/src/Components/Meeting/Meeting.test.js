import React from 'react';
import { MemoryRouter, Route } from 'react-router';
import ReactDOM from 'react-dom';
import Meeting from './Meeting';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    (<MemoryRouter initialEntries={[ '/meeting/1' ]}>
      <Route path="meeting/:id" component={Meeting} />
    </MemoryRouter>),
  div);
});
