import React from 'react';

import {
  generateDisplayTimestamp,
} from '../lib/posts';

import PostTitle from '../components/post-title/post-title.component';

const TITLE = 'Two Tech Stacks, Two Backbone Apps';
const TIMESTAMP = '20130309';
const DISPLAY_TIMESTAMP = generateDisplayTimestamp(TIMESTAMP);

export const config = {
  image: 'https://s3.amazonaws.com/dylants-blog/public/images/20130309/trello_airbnb.png',
  title: TITLE,
  timestamp: TIMESTAMP,
  displayTimestamp: DISPLAY_TIMESTAMP,
};

export default function Post() {
  return (
    <section className="post">
      <PostTitle config={config} />

      <p>
      I've recently come across two well written blog posts from two separate companies detailing their technology stacks.  Working at a technology company myself, I find these articles fascinating, because they outline decisions and tradeoffs they've had to make along the way.  What's fun is finding some that mirror things you've attempted either within your own company or outside by yourself &mdash; these provide a boost in your overall confidence that maybe we're heading in the right direction after all.  Two such posts come from <a href="http://blog.fogcreek.com/the-trello-tech-stack/">Trello</a> and <a href="http://nerds.airbnb.com/weve-launched-our-first-nodejs-app-to-product">Airbnb</a>.  Both are moving towards a pure JavaScript frontend application using Backbone, but their approaches are a bit different.
      </p>

      <h2>Trello: Sometimes the easy choice is the right choice</h2>

      <p>
      <a href="http://blog.fogcreek.com/the-trello-tech-stack/">Trello is doing things in what's becoming the norm</a>: a rich JavaScript web application that pulls its data from REST endpoints served on the backend.  Separation using REST has allowed the JavaScript frontend applications to flourish because the technology stacks can then be completely different.  What's ironic is that even with this separation, the backend stacks are using Node.js more and more.  Certainly Node has disrupted the technology industry allowing what was formally a pure frontend engineer the ability to code in the backend (or slowly bringing backend engineers to the frontend).  In any case, architecting around REST has proven to be a successful strategy.
      </p>

      <p>
      What's interesting about the Trello stack is in it's simplicity.  I must admit I'm a bit envious of something that can be so simple and yet so obvious.  Larger companies seem to get swallowed up in their own internal engineering and out architect the situation at times, and these smaller companies show that the simple solution can work just as well (and cost a lot less).  Certainly the cost of bringing an engineer up to speed on something like the Trello stack (shown below on a single sheet of paper) is significantly less than that of other companies.
      </p>

      <p>
      <a href="http://blog.fogcreek.com/wp-content/uploads/2012/01/trello-freehand.jpg"><img alt="Trello Tech Stack" src="http://blog.fogcreek.com/wp-content/uploads/2012/01/trello-freehand.jpg" width="247" height="360" /></a>
      </p>

      <p>
      Another interesting part of the Trello stack is the way they've approached polling between the fronend and backend.  Once you've got an app running on the frontend with data received from the backend, the tricky part is how to keep it all in sync.  With one user playing in your sandbox, it's easy.  But with multiple people allowed to modify data, along with batch processes, external API calls, etc, you need a single source of truth.  That usually ends up being a service wrapping the database, but how do you broadcast changes to the other systems, especially the frontend client (browser)?  And how do you keep these checks light (in terms of network usage)?
      </p>

      <p>
      <a href="http://socket.io/">Socket.io</a> (and in general web sockets) attempts to provide a solution, but the support so far isn't completely there.  Trello has smartly added a backup of simple polling, which they themselves don't seem too proud of doing.  But again, in its simplicity lies a viable solution.  They describe times of extreme load where web sockets failed them and the backup polling worked fine.  Because of this they've left it in there for the future.
      </p>

      <h2>Airbnb: Backbone on the backend?</h2>

      <p>
      <a href="http://nerds.airbnb.com/weve-launched-our-first-nodejs-app-to-product">Airbnb has also moved to a Backbone/REST/Node stack</a>, but maybe taking the next step in using Backbone not just on the frontend, but also in the backend.  It makes sense &mdash; one of the advantages of using a server framework such as Node is that you've got JavaScript on both sides.  This (should) allow you the flexibility of reusing code across the frontend and backend tech stacks.  But for the most part, we've kept them separate.
      </p>

      <p>
      Airbnb wants to change that by creating what they describe as the "<a href="http://getfile5.posterous.com/getfile/files.posterous.com/temp-2012-10-01/kdFEIqbgcujohgnuzHGvqcJquloxdwBnkvejGFdiCnFuznwiiyHIzafebBhr/shared-js-app.png.scaled1000.png">Holy Grail</a>" with code shared across both sides, frontend and backend.  Although coming to this probably was fueled more by the time savings of rendering the initial page on the server side to begin with, then moving the processing of that page to the client side after initial load.  They've described this change as a drop from 10 seconds to 2 seconds, which is quite huge.  The problem then becomes switching roles between them &mdash; handing off execution from the backend to the frontend.  One could imagine if the frontend JavaScript wasn't ready when the user wanted to interact with the page, they would then need processing by the backend.
      </p>

      <p>
      Airbnb tries to solve this problem by putting Backbone on the backend as well, allowing the same logic to be used to process requests on either side.  This solves the problem I described, while also generating pages that are SEO compliant, and allows code share.  I'm interested in the fine grained details here and hope to see once they've opensourced they're tech stack, Rendr.  But the idea behind it sounds like an easy decision to make once you've got JavaScript running on both sides.  Unfortunately I've seen mostly <a href="http://en.wikipedia.org/wiki/Hijax">Hijax</a> up until now, so it would be interesting to see how they get around some of those issues others have faced.
      </p>

      <h2>A JavaScript Dominated Future?</h2>

      <p>
      I definitely think so.  JavaScript has exploded recently and it doesn't seem to be slowing down.  These two examples show that entire sites can be written in JavaScript and perform quite well.  A good taste of things to come.
      </p>

    </section>
  );
}
