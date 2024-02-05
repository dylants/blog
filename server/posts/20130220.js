import React from 'react';

import {
  generateDisplayTimestamp,
} from '../lib/posts';

import PostTitle from '../components/post-title/post-title.component';

const TITLE = 'reveal.js - HTML Presentations';
const TIMESTAMP = '20130220';
const DISPLAY_TIMESTAMP = generateDisplayTimestamp(TIMESTAMP);

export const config = {
  image: 'https://s3.amazonaws.com/dylants-blog/public/images/20130220/revealjs.jpeg',
  title: TITLE,
  timestamp: TIMESTAMP,
  displayTimestamp: DISPLAY_TIMESTAMP,
};

export default function Post() {
  return (
    <section className="post">
      <PostTitle config={config} />

      <p>
      A few of my coworkers have recently shown me <a href="http://lab.hakim.se/reveal-js/">reveal.js</a>, and it's quite amazing.  If you have to make a presentation, the first thing everyone thinks is PowerPoint.  But if we're working in the web why don't we make presentations on the web?  That's where reveal.js comes in, and every time I see a presentation using reveal there's at least one or two people who ask what was used to make it.
      </p>

      <p>
      Keeping it in the browser allows you to have live demos easily within the presentation, and by presenting you're probably already hosting your presentation for later viewing.  The <a href="https://github.com/hakimel/reveal.js">GitHub repository</a> is available for forking or viewing, and what's even more amazing is there's an <a href="http://www.rvl.io/">online editor complete with theming available</a>!
      </p>

      <p>
      Very cool.
      </p>

    </section>
  );
}
