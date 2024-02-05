import React from 'react';

import {
  generateDisplayTimestamp,
} from '../lib/posts';

import PostTitle from '../components/post-title/post-title.component';

const TITLE = 'GitHub Pages + JavaScript = Awesome';
const TIMESTAMP = '20130202';
const DISPLAY_TIMESTAMP = generateDisplayTimestamp(TIMESTAMP);

export const config = {
  image: 'https://s3.amazonaws.com/dylants-blog/public/images/20130202/github_pages.png',
  title: TITLE,
  timestamp: TIMESTAMP,
  displayTimestamp: DISPLAY_TIMESTAMP,
};

export default function Post() {
  return (
    <section className="post">
      <PostTitle config={config} />

      <p>
      One of the coolest things I've learned of recently is <a href="http://pages.github.com/">GitHub Pages</a>.  GitHub hosts most of the world's code by now, and could just sit back and do nothing, but they constantly keep updating and improving things (have you looked at <a href="https://gist.github.com/">Gists</a> recently?).  With GitHub Pages, anything you put in your "gh-pages" branch and upload to GitHub will be hosted on [username].github.com/[repository].  Most have used this for documentation, but if you have an application that only requires static file hosting, then you can host your entire application via GitHub for free.  I'm not recommending you do this for production or anything, but for side projects it's an excellent way to show a running example of the code without requiring the user download and run it locally.
      </p>

      <p>
      To use, simply perform the following commands:
      </p>

      <pre className="prettyprint">
{`git checkout -b gh-pages
git rebase master
git push origin gh-pages
`}
      </pre>

      <p>
      (make sure to "git checkout master" to continue coding)
      </p>

      <p>
      The first time you do this, GitHub will state it takes about 10 or so minutes to push out the code.  But once done, you've got a running demo of your application.  I've been using this for all my JavaScript projects on GitHub, and it's been great, no problems.  This has made things like <a href="http://www.heroku.com/">Heroku</a> and <a href="http://cloudfoundry.com/">Cloud Foundry</a> less of a necessity and had me trying to use <a href="https://developer.mozilla.org/en-US/docs/DOM/Storage">Local Storage and Session Storage</a> for persistance more often.
      </p>

    </section>
  );
}
