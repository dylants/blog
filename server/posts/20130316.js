import React from 'react';

import {
  generateDisplayTimestamp,
} from '../lib/posts';

import PostTitle from '../components/post-title/post-title.component';

const TITLE = 'less-middleware: using LESS with node.js';
const TIMESTAMP = '20130316';
const DISPLAY_TIMESTAMP = generateDisplayTimestamp(TIMESTAMP);

export const config = {
  image: 'https://s3.amazonaws.com/dylants-blog/public/images/20130316/less-middleware.png',
  title: TITLE,
  timestamp: TIMESTAMP,
  displayTimestamp: DISPLAY_TIMESTAMP,
};

export default function Post() {
  return (
    <section className="post">
      <PostTitle config={config} />

      <p>
      <a href="http://lesscss.org/">LESS</a> is a great way to write CSS, allowing you to use variables, nested rules, mixins, and <a href="http://lesscss.org/#synopsis">many other useful features</a>. If nothing else, I think it helps you better organize your CSS. Recently I've been playing around with Node.js, and wanted to use the <a href="https://npmjs.org/package/less-middleware">less-middleware</a> package so that I could easily use LESS within my application. The less-middleware package automatically handles compiling your LESS code to CSS once you have it configured. Configuration is simple if you store you LESS and CSS in the default locations, but I wanted to use different paths for my source and destination directories. <a href="https://npmjs.org/package/less-middleware#readme">The documentation was a little confusing here</a>, so I thought I'd write up what I found.
      </p>

      <p>
      If you specify a different "src" and "dest" directory, you <strong>must</strong> also supply the "prefix" option, and it must match the path after "public" in your destination directory. An example may be a bit easier to follow:
      </p>

      <pre className="prettyprint">
{`var lessMiddleware = require("less-middleware");

app.use(lessMiddleware({
  src: __dirname + "/less",
  dest: __dirname + "/public/css",
  // if you're using a different src/dest directory, you
  // MUST include the prefex, which matches the dest
  // public directory
  prefix: "/css",
  // force true recompiles on every request... not the
  // best for production, but fine in debug while working
  // through changes
  force: true
}));
app.use(express.static(__dirname + "/public"));
`}
      </pre>

      <p>
      In this example, I've configured the source directory to the "/less" directory within the root of my application. I've also stated I want the compiled CSS output to the "/public/css" directory within the root of my application. At the time of this writing, this did not work <strong>unless</strong> you also specify the "prefix" which matches the path after my "/public" directory. So in this case, I must use "/css" as the prefix. (I've also specified "force: true" so that the less-middleware package compiles my LESS to CSS on every request, which I recommend while your developing.)
      </p>

      <p>
      All that's left is to include your CSS file in your HTML:
      </p>

      <pre className="prettyprint">
{`<link rel="stylesheet", type="text/css", href="css/styles.css">
`}
      </pre>

      <h2>More Examples</h2>

      <p>
      If you need more help in understanding how to use LESS within your Node based projects, you can check out some of my projects on <a href="https://github.com/dylants">GitHub</a>. Specifically, the <a href="https://github.com/dylants/simple-todo">simple-todo</a> application I wrote to review Backbone.js uses LESS and less-middleware. In my app.js file I use the same configuration stated above (although since I'm done developing it, I've commented out the "force: true" option). I also store my LESS file in the "less" directory within the root of the application. My compiled CSS is output in the "public/css" directory, which you'll see is not checked in to GitHub. I've purposely ignored the directory within my .gitignore file ("public/css/*") so I only check in the source LESS and not the compiled CSS. Feel free to clone the project and play around with it to understand how to use less-middleware further.
      </p>

    </section>
  );
}
