import React from 'react';
import { Route } from 'react-router';

import App from './containers/app/app.container';
import Home from './containers/home/home.container';

export default (
  <Route component={App}>
    <Route path="/" component={Home} />
  </Route>
);
