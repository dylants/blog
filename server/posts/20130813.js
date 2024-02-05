import React from 'react';

import {
  generateDisplayTimestamp,
} from '../lib/posts';

import PostTitle from '../components/post-title/post-title.component';

const TITLE = 'Minify Assets using Grunt';
const TIMESTAMP = '20130813';
const DISPLAY_TIMESTAMP = generateDisplayTimestamp(TIMESTAMP);

export const config = {
  image: 'https://s3.amazonaws.com/dylants-blog/public/images/20130813/grunt.png',
  title: TITLE,
  timestamp: TIMESTAMP,
  displayTimestamp: DISPLAY_TIMESTAMP,
};

export default function Post() {
  return (
    <section className="post">
      <PostTitle config={config} />

      <p>
      Development of any project naturally leads to more and more code as you increase the capabilities of your application.  On the server side, this leads to larger compile/build times, and a larger deliverable to servers which host your code.  But the difference between a 1MB deliverable and a 100MB deliverable is negligible, since the transfer of that application is done internally, and only to those few server machines.  On the client side however, delivery of that application happens each time a user visits your site.  And that initial page render can take quite a long time if the user has to download a huge amount of code.  This can be amplified by the number of HTTP requests needed to download you code, if you've chosen to spread it across multiple files.  Thus a large focus of client side application development is on the <a href="https://en.wikipedia.org/wiki/Minification_(programming)">minification</a> of those delivery assets.
      </p>

      <h2>Minifying Assets Developed using AMD</h2>

      <p>
      Minifying assets is not a new concept, and has been something folks in the JavaScript community have been doing for quite some time.  Newer development strategies in client side development come with new techniques on how to minify those same assets.  I choose to develop my client side applications using <a href="http://requirejs.org/">RequireJS</a>, more specifically, using the <a href="http://requirejs.org/docs/whyamd.html">AMD pattern supported by RequireJS</a>.  Development using this pattern breaks up my code in many different files, so the process of minifying these assets involves not only reducing the amount of bytes used to represent the data, but also the amount of HTTP requests needed to pull down the application.  In the end, I want 1 file that has the entire source code, and I want that file minified for delivery.
      </p>

      <h2>Grunt to the Rescue</h2>

      <p>
      <a href="http://gruntjs.com/">Grunt</a> is a very popular JavaScript task runner (similar to <a href="https://ant.apache.org/">Ant</a>) which provides a <a href="http://gruntjs.com/plugins">tremendous amount of plugins</a> developed for the most part by the open source community.  Grunt is designed to work within the Node.js environment.  Some popular uses include executing tests, linting your source code, performing generic build actions, and also minifying your code.  Two plugins that I've found useful for minification are the <a href="https://github.com/gruntjs/grunt-contrib-requirejs">RequireJS plugin</a> and the <a href="https://github.com/gruntjs/grunt-contrib-cssmin">Compress CSS plugin</a>.  When used, these plugins allow for minifying both your JavaScript source code as well as your CSS asset files.
      </p>

      <p>
      Configuring Grunt is pretty straightforward, and there's <a href="http://gruntjs.com/getting-started">ample documentation available on their site</a>.  The important steps are to create a Gruntfile, include the plugins you require in your package.json file, and configure your plugins within the Gruntfile.  If you're not familiar with Grunt, it would probably be a good idea to <a href="http://gruntjs.com/">head over to their site</a> and take a look at what Grunt has to offer.
      </p>

      <h2>RequireJS Optimization</h2>

      <p>
      When you minify your RequireJS based project, you'll be producing a single optimized script file.  However, the pattern for using RequireJS is to script include RequireJS, and point to your require configuration which lists your source files:
      </p>

      <pre className="prettyprint">
{`<script data-main="/js/main" src="/js/lib/require.js"></script>
`}
      </pre>

      <p>
      So what we really want is to minify our assets and script include that, similar to what's written below:
      </p>

      <pre className="prettyprint">
{`<script src="/js/min.js"></script>
`}
      </pre>

      <p>
      The good news is that the RequireJS folks have thought of this and <a href="http://www.requirejs.org/docs/faq-optimization.html">documented how this can be accomplished</a>.  The basic idea is that a separate library, named <a href="https://github.com/jrburke/almond">almond</a>, can be included in the optimized output which will allow AMD patterns without the full use of RequireJS.
      </p>

      <h2>Configuring Grunt's RequireJS Optimization Plugin</h2>

      <p>
      All of the optimization work described above has been taken care of by the <a href="https://github.com/gruntjs/grunt-contrib-requirejs">grunt-contrib-requirejs</a> plugin.  This means that you're able to minify all of your project's assets into a single file through the use of this Grunt plugin.  All that's required is configuration within the Gruntfile.js.  I had previously created a project which uses RequireJS (named simple-todo), and have chosen to minify the assets for this project.  You can find the <a href="https://github.com/dylants/simple-todo">full source code of the project on GitHub</a>.
      </p>

      <p>
      Once the grunt-contrib-requirejs plugin is added to your package.json file, you can begin configuring it in your Gruntfile.js.  Within the grunt.initConfig section include the following (replacing simple-todo specific information with your project data):
      </p>

      <pre className="prettyprint">
{`// require js optimization
requirejs: {
  compile: {
    options: {
      // name is required
      name: "todo-main",
      // the base path of our optimization
      baseUrl: "public/js/todo",
      // include almond to get define (in place of require.js)
      include: "../lib/almond-0.2.5",
      // use our original main configuration file to avoid
      // duplication.  this file will pull in all our dependencies
      mainConfigFile: "public/js/todo/todo-main.js",
      // the output optimized file name
      out: "public/js/todo/todo-min.js"
    }
  }
}
`}
      </pre>

      <p>
      This code issues the "compile" command for this plugin and includes the main configuration file for RequireJS used within the project.  Note that it also includes <a href="https://github.com/jrburke/almond">almond</a>, which must be available to perform RequireJS optimization.  The output of this minification will be in "public/js/todo/todo-min.js".  (<a href="https://github.com/dylants/simple-todo/blob/master/Gruntfile.js">For the full source of the Gruntfile.js, head over to the GitHub repository</a>.)
      </p>

      <p>
      The great thing about this plugin is that it scans all your dependencies in your RequireJS main configuration file, includes them all in the correct order, and minifies them into a single file.  This means that I can script include that single output file and see only 1 HTTP request for my project's dependencies, and the size of the request greatly reduced.
      </p>

      <h2>Configuring Grunt's Compress CSS Plugin</h2>

      <p>
      Very similarly, the grunt-contrib-cssmin plugin minifies CSS assets into a single deliverable.  It's configuration is a bit simpler, not requiring any outside dependencies:
      </p>

      <pre className="prettyprint">
{`// CSS minify
cssmin: {
  add_banner: {
    options: {
      // adds this banner to the minified output
      banner: "/* Simple Todo minified CSS */"
    },
    // minify all files found in the CSS directory
    // to a single output file
    files: {
      "public/css/todo-app.min.css": ["public/css/**/*.css"]
    }
  }
}
`}
      </pre>

      <p>
      I've used the "add_banner" command to include a comment banner on the optimized CSS output file.  This command will scan my "public/css" directory for any CSS files and include them in the minified output file, stored as "public/css/todo-app.min.css".
      </p>

      <h2>Executing the Plugins</h2>

      <p>
      Once the plugins are configured, a few more steps are required.  You must load the NPM tasks for the plugins within your Gruntfile, and I've also configured these tasks to execute in the default task (run when not specifying any arguments to Grunt):
      </p>

      <pre className="prettyprint">
{`// load the tasks we've utilized within this config
grunt.loadNpmTasks("grunt-contrib-requirejs");
grunt.loadNpmTasks("grunt-contrib-cssmin");

// define the default (no arg) task to run requirejs and cssmin
grunt.registerTask("default", ["requirejs", "cssmin"]);
`}
      </pre>

      <p>
      Once this is done, simply execute "grunt" from your project's root directory to minify your assets.
      </p>

      <h2>Setup Development and Production Pages</h2>

      <p>
      I've found that it's useful to setup a separate page which includes my minified assets for a "production environment" and keep my non-minified assets on my "development environment" page.  In the Node.js world, working with <a href="http://expressjs.com/">Express</a> makes this rather easy.  The <a href="http://expressjs.com/api.html">Express API</a> covers how to access the current environment, which is triggered off a "NODE_ENV" environment variable.  So if I was to set this variable to "production" Express would believe it to be in the production environment.
      </p>

      <p>
      In my controller, I've then keyed off this variable to decide which page to render &mdash; my production page or my development page:
      </p>

      <pre className="prettyprint">
{`if (app.get("env") == "production") {
  res.render("simple-todo-production.html");
} else {
  res.render("simple-todo-development.html");
}
`}
      </pre>

      <p>
      And my production page includes the minified assets:
      </p>

      <pre className="prettyprint">
{`<link href="/css/todo-app.min.css" rel="stylesheet", type="text/css">
<script src="/js/todo/todo-min.js"></script>
`}
      </pre>

      <p>
      While my development page includes the non-minified assets, making it easier to debug problems:
      </p>

      <pre className="prettyprint">
{`<link href="/css/todo-app.css" rel="stylesheet", type="text/css">
<script data-main="/js/todo/todo-main" src="/js/lib/require-2.1.5.js"></script>
`}
      </pre>

    </section>
  );
}
