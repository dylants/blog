import React, { PropTypes } from 'react';

import Header from '../../components/header/header.component';

export default function App({ children }) {
  return (
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml">

      <head>
        <title>Randomness in Code</title>

        <meta charSet="utf-8" />
        <meta httpEquiv="Content-type" content="text/html;charset=UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />

        <link rel="stylesheet" href="/public/style.css" />

        <link href="https://fonts.googleapis.com/css?family=Bitter:300,400" rel="stylesheet" />
      </head>

      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}

App.propTypes = {
  children: PropTypes.node.isRequired,
};
