import express from 'express';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';

import routes from './routes';

const logger = require('./lib/logger')();

// Create the express application
const app = express();

// serve the static assets (js/css)
app.use('/assets', express.static(path.join(__dirname, 'assets')));

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
