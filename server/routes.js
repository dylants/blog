import React from 'react';
import { Route } from 'react-router';

import {
  getPosts,
  generatePostUrl,
} from './lib/posts';

import App from './containers/app/app.container';
import Home from './containers/home/home.container';

const POSTS = getPosts();
const routes = POSTS.map(post => (
  <Route
    path={generatePostUrl(post.config.timestamp, post.config.title)}
    component={post.default}
    key={post.config.timestamp}
  />
));

export default (
  <Route component={App}>
    <Route path="/" component={Home} />
    {routes}
  </Route>
);
