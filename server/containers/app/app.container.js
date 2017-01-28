import React, { PropTypes } from 'react';

export default function App({ children }) {
  return (
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml">

      <head>
        <title>Randomness in Code</title>

        <meta charSet="utf-8" />
        <meta httpEquiv="Content-type" content="text/html;charset=UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />

        <link rel="stylesheet" href="/assets/style.css" />

        <link href="https://fonts.googleapis.com/css?family=Roboto:300,400" rel="stylesheet" type="text/css" />
      </head>

      <body>
        {children}
      </body>
    </html>
  );
}

App.propTypes = {
  children: PropTypes.node.isRequired,
};
