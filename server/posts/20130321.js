import React from 'react';

import {
  generateDisplayTimestamp,
} from '../lib/posts';

import PostTitle from '../components/post-title/post-title.component';

const TITLE = 'Using Travis Continuous Integration for your Open Source project';
const TIMESTAMP = '20130321';
const DISPLAY_TIMESTAMP = generateDisplayTimestamp(TIMESTAMP);

export const config = {
  image: 'https://s3.amazonaws.com/dylants-blog/public/images/20130321/travis.png',
  title: TITLE,
  timestamp: TIMESTAMP,
  displayTimestamp: DISPLAY_TIMESTAMP,
};

export default function Post() {
  return (
    <section className="post">
      <PostTitle config={config} />

      <img src="https://s3.amazonaws.com/dylants-blog/public/images/20130321/build_passing.png" alt="build passing" />

      <p>
      I'm a big fan of <a href="http://en.wikipedia.org/wiki/Continuous_integration">Continuous Integration</a> in software projects.  My background in Java introduced me to this early on with Hudson (now <a href="http://jenkins-ci.org/">Jenkins</a>), a great tool to build your Maven based Java project, run your unit tests, and publish your build to the Maven repo.  Browsing GitHub projects, I've seen tons of these "build passing" icons on readme's like the one shown above, and wondered how I could integrate my project into one of these systems.  Also, having recently entered the world of Node, I was wondering if there was a similar setup like I had in my Java/Jenkins based projects for unit testing.
      </p>

      <h2>Travis CI</h2>

      <p>
      <a href="http://travis-ci.org/">Travis CI</a> is responsible for the icons, and it's a great resource to take advantage of if you're using GitHub to host your projects.  Travis CI is a free to use, open source project available to run your build jobs at <a href="http://travis-ci.org/">http://travis-ci.org/</a>.  This means you can have your unit tests run on every checkin, displaying the build status to those interested.  All you have to do is setup your project to run your tests in a way suitable to the Travis CI interface, enable your project to use Travis CI in GitHub, and push a change.  The rest will be handled automatically.
      </p>

      <h2>Tests for your Project</h2>

      <p>
      For me, I first needed to setup a testing environment in my project.  Right now I'm working on building another Backbone application, this time using Node as the backend, so I looked for a unit test solution within Node.  (Travis CI supports a variety of languages other than JavaScript/Node, for others see their <a href="http://about.travis-ci.org/docs/#Specific-Language-Help">language support section</a>.)  After looking through the many (many) options out there, and debating between the two more well known (<a href="http://visionmedia.github.com/mocha/">Mocha</a> and <a href="http://pivotal.github.com/jasmine/">Jasmine</a>), I decided on Jasmine because it seemed more familiar having just recently done work in Rails.  Jasmine also came fully loaded with a test engine, expect library, and the ability to spy on function calls.  Jasmine also has support for Node with the <a href="https://github.com/mhevery/jasmine-node">jasmine-node</a> package.
      </p>

      <p>
      To setup Jasmine in my Node project, I added the jasmine-node dependency in my package.json, and added a "test" script to execute jasmine on my /spec directory when called.  Note the use of "devDependencies" instead of "dependencies" for jasmine-node, as suggested in the <a href="https://npmjs.org/doc/json.html#devDependencies">npm package.json documentation</a>, which keeps test dependencies out of production code.
      </p>

      <pre className="prettyprint">
{`{
  "name": "simple-todo",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "start": "nodemon app.js",
    "test": "./node_modules/.bin/jasmine-node spec/"
  },
  "dependencies": {
    "express": "~3.1.0",
    "nodemon": "~0.7.2",
    "ejs": "~0.8.3",
    "less-middleware": "~0.1.9"
  },
  "devDependencies": {
    "jasmine-node": "~1.4.0"
  }
}
`}
      </pre>

      <p>
      Once that was done, I needed to add a test!  I created a simple test just to make sure things worked in my /spec directory.  Keep in mind all tests must end with ".spec.js" (or ".spec.coffee") to be picked up by jasmine-node (more information an be found in the <a href="https://github.com/mhevery/jasmine-node">jasmine-node documentation</a>).
      </p>

      <pre className="prettyprint">
{`var TodoDatabase = require("../utilities/todoDatabase");

describe("A TodoDatabase", function() {
  describe("that is newly constructed", function() {
    var todoDatabase;

    beforeEach(function() {
      todoDatabase = new TodoDatabase();
    });

    it("should be defined", function() {
      expect(todoDatabase.todoDB).toBeDefined();
    });

    it("should be empty", function() {
      expect(todoDatabase.todoDB).toEqual({});
    });
  });
});
`}
      </pre>

      <p>
      This test creates an instance of the "TodoDatabase" and makes sure the instance variable "todoDB" is then defined and empty.  I'm using Jasmine's matchers to verify these things, and many more can be found on the <a href="https://github.com/pivotal/jasmine/wiki/Matchers">matcher wiki</a>.  Once the test is created, I can locally verify the tests are successful by running:
      </p>

      <pre className="prettyprint">
{`$ npm test
`}
      </pre>

      <p>
      Which shows me:
      </p>

      <img src="https://s3.amazonaws.com/dylants-blog/public/images/20130321/tests_pass.png" alt="Tests Pass" width="300" height="73" />

      <p>
      Yay!  My tests pass!
      </p>

      <h2>Enable Travis CI</h2>

      <p>
      Now that I've got tests, I can configure Travis CI to execute my tests on checkin.  The <a href="http://about.travis-ci.org/docs/user/getting-started/">Travis CI getting started guide</a> is probably the best place to begin such a task and I would recommend others do the same.  The first thing the guide recommends you do is sign in to <a href="http://travis-ci.org/">Travis CI</a> using your GitHub credentials.  You'll need to tell GitHub you authorize Travis CI access to your repository information.  Once that's complete, you can enable your project on your <a href="https://travis-ci.org/profile">Travis CI profile page</a>.  This tells Travis CI to monitor this project and/or other projects in your GitHub account.
      </p>

      <h2>.travis.yml</h2>

      <p>
      The next step is creating a configuration file for Travis CI in your project, called the .travis.yml file.  Since my project uses Node, I chose the <a href="http://about.travis-ci.org/docs/user/languages/javascript-with-nodejs/">section on JavaScript with Node.js</a> within the getting started guide which explains how to create the .travis.yml file for your project.  This file is necessary to communicate with Travis CI what language your project is built with along with other language specific details.  Travis CI was originally built for Ruby based projects, so if you don't specify a .travis.yml file, it will assume Ruby.  For a Node based project, you'd want to create a .travis.yml file similar to this in the root directory of your project:
      </p>

      <pre className="prettyprint">
{`language: node_js
node_js:
  - "0.10"
  - "0.8"
  - "0.6"
`}
      </pre>

      <p>
      This tells Travis CI that the language of my project is Node.js, and it should execute my tests on Node version 0.6, 0.8, and 0.10.  I think it's pretty cool it will execute your tests on three separate versions of Node (or more) each time a build is kicked off.  For Node based projects, Travis CI will first execute "npm install" to install your dependencies, then "npm test" to run your tests (which is why it's important to setup your package.json file as I describe above).  Much more information on configuring the .travis.yml file can be found in the <a href="http://about.travis-ci.org/docs/user/getting-started/">getting started guides</a>.
      </p>

      <h2>Push to GitHub, Queue a Travis CI Build</h2>

      <p>
      Your setup is complete!  Now all that's necessary is to push your changes to GitHub (which include the .travis.yml file) and watch Travis CI execute your build.  I found the build was queued, run, and complete within a couple minutes, which is pretty amazing considering it's completely free and available to anyone.  You can monitor your builds from the <a href="https://travis-ci.org/">Travis CI home page</a>, choosing the "My Repositories" tab on the left.  Hopefully your build passes all the tests!
      </p>

      <h2>Add Some Bling to your README</h2>

      <p>
      With the build complete and green, why not add the build icon to your project?  To do so, follow the instructions on the <a href="http://about.travis-ci.org/docs/user/status-images/">Travis CI status images guide</a>.  They have examples for most README languages you'd use in Git, and once it's done, you'll have a nice little icon to impress your friends.
      </p>

      <img src="https://s3.amazonaws.com/dylants-blog/public/images/20130321/build_passing.png" alt="build passing" />

    </section>
  );
}
