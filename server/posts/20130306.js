import React from 'react';

import {
  generateDisplayTimestamp,
} from '../lib/posts';

import PostTitle from '../components/post-title/post-title.component';

const TITLE = 'Debugging Node';
const TIMESTAMP = '20130306';
const DISPLAY_TIMESTAMP = generateDisplayTimestamp(TIMESTAMP);

export const config = {
  image: 'https://s3.amazonaws.com/dylants-blog/public/images/20130306/chrome_debugger.png',
  title: TITLE,
  timestamp: TIMESTAMP,
  displayTimestamp: DISPLAY_TIMESTAMP,
};

export default function Post() {
  return (
    <section className="post">
      <PostTitle title={TITLE} timestamp={DISPLAY_TIMESTAMP} />

      <p>
      A debugger for me, is a necessity.  Going back to the days of print statements to debug seems like something I never want to do.  And with debuggers coming a dime a dozen in the Java world, this is really something we must have if switching to run JavaScript on the server.  Chrome's debugger is certainly at the top of the list for client side debugging, and with the <a href="https://github.com/dannycoates/node-inspector">node-inspector</a>, it's possible to use that same environment to debug any Node based app as well.
      </p>

      <p>
      Setup is simple, per the instructions on <a href="https://github.com/dannycoates/node-inspector">the GitHub repo</a>, first install the package using npm:
      </p>

      <pre className="prettyprint">
{`npm install -g node-inspector
`}
      </pre>

      <p>
      Then startup your node application in debug mode, using either node or <a href="https://github.com/remy/nodemon">nodemon</a>:
      </p>

      <pre className="prettyprint">
{`node --debug .
`}
      </pre>

      <p>
      or
      </p>

      <pre className="prettyprint">
{`nodemon --debug .
`}
      </pre>

      <p>
      This will start the application on the normal port (usually 3000), and also listen for a debugger on another port (usually 5858).  Launch node-inspector in a separate terminal to connect it:
      </p>

      <pre className="prettyprint">
{`node-inspector
`}
      </pre>

      <p>
      Then open up Chrome and point to your localhost, port 5858: <a href="http://127.0.0.1:8080/debug?port=5858">http://127.0.0.1:8080/debug?port=5858</a>.  You can add breakpoints and monitor the app as you would normally a frontend application running in the browser.  This has been really useful in debugging both the client and server when any issue comes up.
      </p>

      <p>
      The <a href="https://github.com/dannycoates/node-inspector">node-inspector GitHub readme</a> has tons more info, check it out!
      </p>

    </section>
  );
}
