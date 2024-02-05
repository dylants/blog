import React, { PropTypes } from 'react';

import Header from '../../components/header/header.component';
import Footer from '../../components/footer/footer.component';

export default function App({ children }) {
  return (
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml">

      <head>
        <title>Randomness in Code</title>

        <meta charSet="utf-8" />
        <meta httpEquiv="Content-type" content="text/html;charset=UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />

        <link rel="icon" href="https://s3.amazonaws.com/dylants-blog/public/images/prompt.png" />

        <link rel="stylesheet" href="/public/prettyprint.css" />
        <link rel="stylesheet" href="/public/style.css" />

        <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Roboto+Slab:300,500" rel="stylesheet" />

      </head>

      <body>
        <Header />
        {children}

        <Footer />
        {/* documentation: https://github.com/googlearchive/code-prettify */}
        <script src="https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js?lang=yaml" />
      </body>
    </html>
  );
}

App.propTypes = {
  children: PropTypes.node.isRequired,
};
