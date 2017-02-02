import React from 'react';

import {
  generateDisplayTimestamp,
} from '../lib/posts';

import PostTitle from '../components/post-title/post-title.component';

const TITLE = 'Testing Node on the Server and Angular on the Client';
const TIMESTAMP = '20150128';
const DISPLAY_TIMESTAMP = generateDisplayTimestamp(TIMESTAMP);

export const config = {
  image: 'https://s3.amazonaws.com/dylants-blog/public/images/20150128/jasmine_karma_protractor.png',
  title: TITLE,
  timestamp: TIMESTAMP,
  displayTimestamp: DISPLAY_TIMESTAMP,
};

export default function Post() {
  return (
    <section className="post">
      <PostTitle title={TITLE} timestamp={DISPLAY_TIMESTAMP} />
      <p>
      One of the most useful features of <a href="https://angularjs.org/">Angular</a>, in my opinion, is the focus on testing your code. Structuring your apps to use dependency injection by default, along with an out-of-the-box solution for unit and integration tests, gives anyone a great head start in testing their client code. Using a similar solution on the server side, and wiring it all together with a tool like <a href="http://gruntjs.com/">Grunt</a>, provides you with complete testing of your web application.

      </p>
      <p>
      The examples below are mostly taken from the <a href="https://github.com/dylants/meanjs-template">meanjs-template</a>, which takes advantage of the <a href="http://meanjs.org/">MEAN.JS stack</a>. Additionally, the <a href="https://github.com/dylants/colors">colors application</a> uses the same test frameworks, but does so with just plain Node, Express, and Angular. Please feel free to use either to gain more information on the topic.
      </p>

      <h2>Server Side: Jasmine Unit Tests</h2>

      <p>
      There's an ongoing debate (as with most anything in the JavaScript world) on which framework to use for unit testing your server side code. For me it came down to <a href="http://mochajs.org/">Mocha</a> or <a href="https://jasmine.github.io/">Jasmine</a>. I actually prefer the flexibility Mocha provides when paired with an assertion library such as <a href="http://chaijs.com/">Chai</a>, but because Jasmine is used (by default) on the client side, it felt natural to use the same framework on the server side.
      </p>

      <p>
      To use Jasmine within the Node environment, I chose to use the popular <a href="https://github.com/mhevery/jasmine-node">jasmine-node</a> module. Another very useful module is <a href="https://github.com/jhnns/rewire">rewire</a> which allows you to access "private" functions and variables from within your source modules. So for instance, if you would like to test a function which is not explicitly exported, you can still gain access to the function in this way:
      </p>

      <pre className="prettyprint">
{`var hiddenFunction = myModule.__get__("hiddenFunction");
`}
      </pre>

      <h3>Example Test</h3>

      <p>
      I usually create a folder within my project named <code>test</code>, and within that, a directory for the <code>server</code> side tests. From there the directory structure mirrors the source code which it tests. In the <a href="https://github.com/dylants/meanjs-template">meanjs-template</a> project I have a sample <code>logger.js</code> module within the <code>app/lib</code> directory. Correspondingly, in the <code>test/server</code> directory I have a <code>logger.test.js</code> file in the same <code>app/lib</code> directory.
      </p>

      <p>
      Testing the logic using Jasmine then becomes fairly simple, now that I can get access to both the exported and "private" functions. For example, here's a snippet of <code>logger.test.js</code>:
      </p>

      <pre className="prettyprint">
{`"use strict";

var rewire = require("rewire");

describe("The logger library", function() {
    var logger;

    beforeEach(function() {
        logger = rewire("../../../../app/lib/logger");
    });

    it("should exist", function() {
        expect(logger).toBeDefined();
    });

    it("should return test decorator in test environment", function() {
        var _getDecorator;

        _getDecorator = logger.__get__("_getDecorator");

        expect(_getDecorator()).toEqual("meanjs-template:test_environment");
    });

    // ...
});
`}
      </pre>

      <h2>Client Side: Karma Unit Tests</h2>

      <p>
      Using Angular on the client side somewhat simplifies our choices for frameworks, as they provide great integration with <a href="https://karma-runner.github.io">Karma</a> for unit tests. Karma (by default) is setup to use <a href="https://jasmine.github.io/">Jasmine</a> as it's test framework and is configured via it's <code>karma.conf.js</code> file.
      </p>

      <h3><code>karma.conf.js</code></h3>

      <p>
      That configuration is pretty straightforward, and for the most part you'll only need to supply Karma with the files you want to test, and how you want to test them. Below is an example <code>karma.conf.js</code> file from the <a href="https://github.com/dylants/meanjs-template">meanjs-template</a> I've built, and even though I take advantage of the <a href="http://meanjs.org/">MEAN.JS</a> configuration for the files, the concept is still the same:
      </p>

      <pre className="prettyprint">
{`"use strict";

var applicationConfiguration = require("./config/config");

module.exports = function(config) {
    config.set({

        files: applicationConfiguration.assets.lib.js.concat(applicationConfiguration.assets.js, applicationConfiguration.assets.tests),

        autoWatch: true,

        frameworks: ["jasmine"],

        browsers: ["Chrome", "Firefox"],

        plugins: [
            "karma-chrome-launcher",
            "karma-firefox-launcher",
            "karma-jasmine"
        ]
    });
};
`}
      </pre>

      <p>
      In this file I'm configuring Karma to load both the source JavaScript files (including the 3rd party libraries) as well as the test JavaScript files. (Note that the <code>files</code> attribute expects an array of file names.) Additionally, Karma is configured to watch for any file changes, use the Jasmine test framework, and run it's tests through both the Chrome and Firefox browsers.
      </p>

      <h3>Example Test</h3>

      <p>
      In the same way as the server side tests, I create a <code>test/client</code> directory to house my client side tests. Within that directory I create a <code>unit</code> directory to contain the unit tests. From there the directory structure mirrors the client side source code.
      </p>

      <p>
      So for example, I have an Angular controller called <code>app.client.controller.js</code> that lives in the <code>global/controllers</code> directory. So on the test side I then have a <code>global/controllers</code> directory within the <code>test/unit</code> folder, and a file named <code>app.client.controller.test.js</code> within that folder structure to test the controller.
      </p>

      <p>
      It's important when testing Angular controllers to load the module prior to injecting the controller into your test. You also are responsible for creating the dependencies for the controller and injecting them in prior to running your tests. This has the benefit of giving you complete control over the dependencies, which allows you to easily test error conditions or create a situation for any test. Keeping to our example, this is the contents of the <code>app.client.controller.test.js</code> file contained within the <a href="https://github.com/dylants/meanjs-template">meanjs-template</a>:
      </p>

      <pre className="prettyprint">
{`"use strict";

describe("AppCtrl", function() {
    var $scope, controller;

    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    beforeEach(inject(function($rootScope, $controller) {
        // create a new $scope for each test
        $scope = $rootScope.$new();

        // use the new $scope in creating the controller
        controller = $controller("AppCtrl", {
            $scope: $scope
        });

    }));

    it("should exist", function() {
        expect(controller).toBeDefined();
    });
});
`}
      </pre>

      <p>
      This test first loads the root module, loading the Angular application. It then uses the <code>inject</code> function to provide us with a <code>$rootScope</code> and <code>$controller</code> (benefits of using the Karma framework). We can use these to create a <code>$scope</code> and pass that in when loading our <code>AppCtrl</code>.
      </p>

      <p>
      Our one test simply checks that the controller is defined, but you can imagine additional tests as the logic for your controller grows. Check out the <a href="https://karma-runner.github.io">Karma documentation</a> for more information on how to use Karma to test your source code.
      </p>

      <h2>Client Side: Protractor End to End Tests</h2>

      <p>
      Angular's integration with <a href="https://angular.github.io/protractor">Protractor</a> to provide end to end tests can be extremely powerful. Using this, in addition to the unit tests of your server and client side code, provides a set of tests that truly validate your source code's functionality.
      </p>

      <p>
      If you're not familiar with Protractor, it provides some additional tooling around <a href="http://docs.seleniumhq.org/projects/webdriver/">Selenium's WebDriver</a>, which allows you to automate an actual interaction with the browser (typing the keys to fill out a form, clicking buttons, etc). See the <a href="https://angular.github.io/protractor/#/api">Protractor API</a> for more information on what's available.
      </p>

      <h3><code>protractor-conf.js</code></h3>

      <p>
      Protractor has a configuration file which you use to state where your test files are located, what browsers will be used during testing, the test framework, etc. Similar to the unit tests, I generally place my end to end tests within the <code>test/client/e2e</code> directory. Below is an example <code>protractor-conf.js</code> file:
      </p>

      <pre className="prettyprint">
{`"use strict";

exports.config = {
    allScriptsTimeout: 11000,

    specs: [
        "test/client/e2e/*.js"
    ],

    multiCapabilities: [{
        browserName: "firefox"
    }, {
        browserName: "chrome"
    }],

    baseUrl: "http://localhost:3000/",

    beforeLaunch: function() {
        console.log("Starting setup...");

        // Return a promise when dealing with asynchronous
        // functions here (like creating users in the database)
    },

    afterLaunch: function() {
        console.log("Starting cleanup...");

        // Return a promise when dealing with asynchronous
        // functions here (like removing users from the database)
    },

    framework: "jasmine",

    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000
    }
};
`}
      </pre>

      <p>
      This file takes advantage of the <code>multiCapabilities</code> configuration attribute to state that the tests should run in both Firefox and Chrome. There is also <code>beforeLaunch</code> and <code>afterLaunch</code> functions defined which provide us a hook for any test setup or tear down (for example, create a test user to use during login).
      </p>

      <p>
      Another key configuration attribute is the <code>baseUrl</code> which states where Protractor will begin it's tests. Note that we've supplied <code>http://localhost:3000</code>, which means we'll need to start our web server prior to running the Protractor tests.
      </p>

      <h3>Example Test</h3>

      <p>
      The <a href="https://angular.github.io/protractor/#/tutorial">Protractor tutorial</a> provides a great overview on how to write tests which I recommend looking over. Below is an example test used in the same <a href="https://github.com/dylants/meanjs-template">meanjs-template</a>:
      </p>

      <pre className="prettyprint">
{`"use strict";

describe("meanjs-template App", function() {
    beforeEach(function() {
        // get the root of the project
        browser.get("/");
    });

    it("should display heading", function(done) {
        browser.getTitle().then(function(title) {
            expect(title).toEqual("meanjs-template");
            done();
        });
    });
});
`}
      </pre>

      <p>
      This test navigates to the root of the project, then verifies the page title is correct. Protractor provides many additional functions to get elements on the page using Angular specific concepts, such as <a href="https://angular.github.io/protractor/#/api?view=ProtractorBy.prototype.binding">by binding</a> or <a href="https://angular.github.io/protractor/#/api?view=ProtractorBy.prototype.model">by model</a>.
      </p>

      <h2>Using Grunt to Wire it All Together</h2>

      <p>
      Now that we have all three of the test groups setup, the difficulty comes in running them all together. A build system like <a href="http://gruntjs.com/">Grunt</a> helps solve this problem by enabling us to run these groups of tests, one after another, resulting in full validation of our application. (In addition to the tests above, we can also add in <a href="https://www.npmjs.com/package/grunt-contrib-jshint">jshint</a> along with <a href="https://www.npmjs.com/package/grunt-contrib-csslint">csslint</a> to validate our source code semantics.)
      </p>

      <p>
      View the <a href="http://gruntjs.com/getting-started">getting started guide for Grunt</a> to get your project initially setup. The three Grunt plugins I chose to use to run the tests are <a href="https://www.npmjs.com/package/grunt-jasmine-node">grunt-jasmine-node</a>, <a href="https://www.npmjs.com/package/grunt-karma">grunt-karma</a>, and <a href="https://www.npmjs.com/package/grunt-protractor-runner">grunt-protractor-runner</a>. With all of that installed, the <code>Gruntfile.js</code> for our tests becomes:
      </p>

      <pre className="prettyprint">
{`"use strict";

module.exports = function(grunt) {
    grunt.initConfig({
        jasmine_node: {
            options: {
                forceExit: true,
                matchall: true,
                showColors: true,
                includeStackTrace: true
            },
            all: ["test/server"]
        },
        karma: {
            all: {
                configFile: "karma.conf.js",
                singleRun: true
            }
        },
        protractor: {
            all: {
                configFile: "protractor-conf.js",
                keepAlive: true
            }
        }
    });

    require("load-grunt-tasks")(grunt);

    grunt.registerTask("server", "Start the server", function() {
        require("./server.js");
    });

    grunt.registerTask("test", ["jasmine_node", "karma", "server", "protractor"]);
};
`}
      </pre>

      <p>
      The above configuration file specifies the options for Jasmine, Karma, and Protractor (mostly default options), loads all the necessary Grunt tasks, and defines two of our own tasks: one to start the server, and one which will run our tests. We'll need to start the server prior to running the Protractor tests, since Protractor is a true end to end test harness.
      </p>

      <p>
      With this <code>Gruntfile.js</code> in place, executing the tests from the command line can by done with the following command:
      </p>

      <pre className="prettyprint">
{`$ grunt test
`}
      </pre>

      <p>
      This will run the server side unit tests with Jasmine, the client side unit tests with Karma, and the end to end tests with Protractor. Pretty cool stuff!
      </p>

      <p>
      Check out the <a href="https://github.com/dylants/colors">colors application</a> for additional examples, or the <a href="https://github.com/dylants/meanjs-template">meanjs-template</a> for examples on how to use this with continuous integration, like Jenkins or Travis CI.
      </p>
    </section>
  );
}
