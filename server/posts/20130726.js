import React from 'react';

import {
  generateDisplayTimestamp,
} from '../lib/posts';

import PostTitle from '../components/post-title/post-title.component';

const TITLE = 'JavaScript UI Testing with Zombie.js';
const TIMESTAMP = '20130726';
const DISPLAY_TIMESTAMP = generateDisplayTimestamp(TIMESTAMP);

export const config = {
  image: 'https://s3.amazonaws.com/dylants-blog/public/images/20130726/zombiejs.png',
  title: TITLE,
  timestamp: TIMESTAMP,
  displayTimestamp: DISPLAY_TIMESTAMP,
};

export default function Post() {
  return (
    <section className="post">
      <PostTitle config={config} />

      <p>
      Unit tests can be great to verify your source code, but there are times when integration tests provide a more useful report on the stability of your application.  Yes, integration tests (most likely) require more setup than unit tests, and yes, they will (again, most likely) test things outside of the code you wrote.  But they also come with a huge upside in that they test what your customers will use &mdash; the end product stack.  And including integration tests in your continuous integration builds can track how that experience functions over time.  Successful integration tests provide you with a real sense that your application performs correctly from end to end.
      </p>

      <p>
      Although there are many possible integrations to test within an application, I'd like to focus on testing at the UI layer.  Within the Node.js environment, there are (of course) many options available to you.  One of the more popular tools to assist in UI testing is <a href="http://phantomjs.org/">PhantomJS</a>.  PhantomJS is not, however, a test tool but instead a headless WebKit, and requires a testing framework which may need additional configuration.  In some cases this might be necessary, but in other cases, a simpler solution is all that's required. <a href="http://zombie.labnotes.org/">Zombie.js</a> provides that with very minimal setup and an intuitive interface for your UI testing needs.
      </p>

      <h2>Zombie.js Overview</h2>

      <p>
      For those with a Java background, I'd compare Zombie with <a href="http://htmlunit.sourceforge.net/">HtmlUnit</a>.  It's a headless browser that provides you with a programatic interface into loading pages, filling out forms, and clicking buttons or links.  The folks behind Zombie have provided some <a href="http://zombie.labnotes.org/">pretty entertaining documentation</a> which does a good job of describing how to use Zombie.  The very first example on the documentation's home page shows just how easy it is to use, by loading a page, filling out a form, and clicking a button, then verifying the page displayed is correct.
      </p>

      <h2>Project Setup for Zombie</h2>

      <p>
      Once you've <a href="https://npmjs.org/package/zombie">added zombie as a dependency</a>, you're ready to use it in a test.  But before we do that, it's important to configure your project to run the server when executing your tests.  In a typical Node/Express project, you specify an app.js (or index.js) file which details the configuration of your server while also starting your server on a configured port.  We'll want to separate the configuration from the server start so that we can choose when to start the server from within the tests.
      </p>

      <p>
      In my <a href="https://github.com/dylants/simple-todo">simple-todo project</a>, I've taken the "app.listen" code from my app.js file, and moved it to an index.js file.  My app.js file now ends with:
      </p>

      <pre className="prettyprint">
{`// instead of starting the application here, export the app so that it can
// be loaded differently based on the use case (running the app vs testing)
module.exports = app;
`}
      </pre>

      <p>
      This allows me to include the app.js in my newly created index.js, which contains the following:
      </p>

      <pre className="prettyprint">
{`var app = require("./app");

app.listen(app.get("port"), function() {
  console.log("Express server listening on port " + app.get("port"));
});
`}
      </pre>

      <p>
      Now instead of launching my server with "node app.js" I simply run "node index.js" with the end result being the same.  Additionally my tests can include the configuration of app.js without starting the server.
      </p>

      <h2>Creating a Zombie Test</h2>

      <p>
      I prefer to use <a href="http://visionmedia.github.io/mocha/">Mocha</a>/<a href="http://chaijs.com/">Chai</a> as my test framework, which has great integration with Zombie.  I've created a Zombie based test in my <a href="https://github.com/dylants/simple-todo">simple-todo project</a> which I'll be discussing below.  The <a href="https://github.com/dylants/simple-todo/blob/master/test/web/zombie/zombie-todo-web-test.js">full source of the test</a> can be found in the GitHub repository of the simple-todo project.
      </p>

      <p>
      To begin, bring in the dependencies for Zombie and assert, as well as the app.js file we created above.  This allows us to start and stop our Express server within the test, which is necessary when running the integration tests.
      </p>

      <pre className="prettyprint">
{`var assert = require("chai").assert,
    Browser = require("zombie"),
    app = require("../../../app");
`}
      </pre>

      <p>
      Mocha provides hooks to execute code before and after all the tests run, and before and after each test runs.  Using these hooks, we can start and stop our Express server with the following code:
      </p>

      <pre className="prettyprint">
{`before(function() {
  // before ALL the tests, start our Express server (on a test port, 3001)
  server = app.listen(3001);
});

after(function() {
  // after ALL the tests, close the server
  server.close();
});
`}
      </pre>

      <p>
      The last bit of test setup is creating a new Zombie browser.  It's useful to create a new one for each test so that we know we're getting a clean slate at the start, and no test will adversely affect the other.
      </p>

      <pre className="prettyprint">
{`beforeEach(function() {
  // before EACH test, create a new zombie browser
  browser = new Browser();
});
`}
      </pre>

      <p>
      From here, you can begin to write your tests.  Using a combination of the documentation from the <a href="http://zombie.labnotes.org/API">Zombie API</a> and the <a href="http://zombie.labnotes.org/selectors">Zombie CSS Selectors</a>, it's pretty easy to begin with some simple tests.  Keep in mind that because of the asynchronous nature of JavaScript, you'll probably need to include a done callback in your tests to avoid the test from finishing before the browser has loaded, or an action is complete.  An example may be worthwhile here &mdash; the first test I wrote was to load the simple-todo main page and verify it's page contents:
      </p>

      <pre className="prettyprint">
{`it("should show the login page to begin", function(done) {
  browser.visit(todoUrl, function() {
    assert(browser.text("#page-heading") === "Simple Todo",
      "page heading must match");
    assert(browser.text("#login-heading") === "Welcome to Simple Todo",
      "login heading must exist and match");

    // done with test
    done();
  });
});
`}
      </pre>

      <p>
      This test begins by using Zombie's browser instance to "visit" the URL of the simple-todo application.  A callback is provided which is executed once the page finishes loading, and within that function we provide some assert statements to verify the page data.  Here again we use Zombie's browser to grab text from the page, using CSS selectors to find the page heading and login heading.  And after all that is complete, we call the done callback to signal to Mocha that our test is complete.
      </p>

      <h2>More Fun with Zombies</h2>

      <p>
      Zombie provides many more abilities than what I've described in the test above, and I encourage you to <a href="http://zombie.labnotes.org/API">check out the full API documentation</a>.  They provide a basic callback structure which I've used in the test above, but also provide a promise model which I've used in the <a href="https://github.com/dylants/simple-todo/blob/master/test/web/zombie/zombie-todo-web-test.js">Zombie test within the simple-todo project</a>.  I've found Zombie to be a very quick and easy way to create integration tests for your web application.  And because it integrates seamlessly with Mocha, executing your integration tests along side of your existing unit tests is no work at all.
      </p>

      <p>
      And with all that talk about zombies, <a href="http://www.youtube.com/watch?v=6Ejga4kJUts">I'm sure you're all ready to listen to this</a>.
      </p>

    </section>
  );
}
