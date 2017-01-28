import express from 'express';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import sassMiddleware from 'node-sass-middleware';

import routes from './routes';

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const APP_ROOT = path.join(__dirname, '../');

const logger = require('./lib/logger')();

// Create the express application
const app = express();

if (IS_DEVELOPMENT) {
  // in development mode, re-generate the css code from sass every request
  app.use(sassMiddleware({
    src: path.join(__dirname, 'styles'),
    dest: path.join(APP_ROOT, 'public'),
    debug: true,
    outputStyle: 'compressed',
    prefix: '/public',
    force: true,
  }));
}

if (IS_PRODUCTION) {
  // serve the static assets (js/css)
  app.use('/public', express.static(path.join(APP_ROOT, 'public')));
}

// for all other requests, process them using react-router
app.get('*', (req, res) => {
  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      logger.error('express: error rendering route, req.url: %s', req.url);
      logger.error(error);
      return res.status(500).send(error.message);
    }

    if (redirectLocation) {
      return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    }

    // this could be a 404 page, but instead, redirect them to the home page
    if (!renderProps) {
      return res.redirect(302, '/');
    }

    // with no errors and no redirects, render the page
    return res.status(200).send(renderToString(<RouterContext {...renderProps} />));
  });
});

module.exports = app;
