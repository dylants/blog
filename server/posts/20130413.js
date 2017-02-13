import React from 'react';

import {
  generateDisplayTimestamp,
} from '../lib/posts';

import PostTitle from '../components/post-title/post-title.component';

const TITLE = 'Node Version Manager (NVM)';
const TIMESTAMP = '20130413';
const DISPLAY_TIMESTAMP = generateDisplayTimestamp(TIMESTAMP);

export const config = {
  image: 'https://s3.amazonaws.com/dylants-blog/public/images/20130413/nodejs.png',
  title: TITLE,
  timestamp: TIMESTAMP,
  displayTimestamp: DISPLAY_TIMESTAMP,
};

export default function Post() {
  return (
    <section className="post">
      <PostTitle title={TITLE} timestamp={DISPLAY_TIMESTAMP} />

      <a href="http://nodejs.org/">Node.js</a> has a <a href="https://npmjs.org/">great package manager</a> to manage the dependencies of your Node projects, but what about managing the versions of Node itself? <a href="https://rvm.io/">Ruby has a version manager called RVM</a> that most folks in the community know to use right from the start.  I've installed Node, like most others, using the default installer provided by Node.  This (more than likely) requires sudo access because of where the default install location resides, and additionally will require sudo access when installing packages globally.  And that decision leads to huge confusion initially (see <a href="http://stackoverflow.com/questions/4938592/how-why-does-npm-recommend-not-running-as-root">here</a> and <a href="http://howtonode.org/introduction-to-npm">here</a> and even <a href="http://tnovelli.net/blog/blog.2011-08-27.node-npm-user-install.html">here</a>) because running things blindly with sudo is bad, much like crossing the streams (right Egon?).

      <p>
      So maybe it was my lack of knowledge in the Node community, but I recently found out about <a href="https://github.com/creationix/nvm">NVM</a>, a version manager much like RVM, which avoids the sudo problem by installing to your home directory.  It provides easy access to install multiple versions of Node, and switch versions easily.  Your NPM global packages are installed along side the specific version of Node, so they don't mix when switching between versions.  And of course you can set a default Node version which will be used when starting a terminal/command prompt.  After using NVM for a bit, I highly recommend it over other Node install options.  (<a href="http://stackoverflow.com/questions/11177954/how-do-i-completely-uninstall-node-js-and-reinstall-from-beginning-mac-os-x">I've even uninstalled Node from the default installer location</a>.)
      </p>

      <a href="https://github.com/creationix/nvm">Check it out!</a>

    </section>
  );
}
