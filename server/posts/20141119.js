import React from 'react';

import {
  generateDisplayTimestamp,
} from '../lib/posts';

import PostTitle from '../components/post-title/post-title.component';

const TITLE = 'Bundling Production Assets for MEAN.JS';
const TIMESTAMP = '20141119';
const DISPLAY_TIMESTAMP = generateDisplayTimestamp(TIMESTAMP);

export const config = {
  image: 'https://s3.amazonaws.com/dylants-blog/public/images/20141119/meanjs.png',
  title: TITLE,
  timestamp: TIMESTAMP,
  displayTimestamp: DISPLAY_TIMESTAMP,
};

export default function Post() {
  return (
    <section className="post">
      <PostTitle config={config} />

      <p>
      Lately, I've been writing a lot of Angular on the client side and Node on the server side. More specifically, I've been using the <a href="http://meanjs.org/">MEAN.JS</a> template in projects I create, which helps layout a structure to organize the code. Yes, there's a lot of bloat that comes with some of these template projects (and especially with the generators), but once it's all cleaned up and tailored to your project, I think it works very well.
      </p>

      <p>
      One of the best features of this template is the way client side code is organized and prepared for the various deploy environments. The stack comes pre-configured with a default environment (<code>all.js</code>) which contains, among other things, a list of assets that should be included when loading your client side application. These assets are automatically added to your initial rendered view, which starts your Angular app and runs your client side code. There are also environment overrides for development, production, etc. For example, the default <code>all.js</code> contains both vendor assets and your application assets under the <code>assets</code> object (tests were removed from this example for brevity):
      </p>

      <pre className="prettyprint">
{`assets: {
    lib: {
        css: [
            "public/lib/bootstrap/dist/css/bootstrap.css",
            "public/lib/bootstrap/dist/css/bootstrap-theme.css"
        ],
        js: [
            "public/lib/angular/angular.js",
            "public/lib/angular-resource/angular-resource.js",
            "public/lib/angular-ui-router/release/angular-ui-router.js"
        ]
    },
    css: [
        "public/modules/**/css/*.css"
    ],
    js: [
        "public/config.js",
        "public/application.js",
        "public/modules/*/*.js",
        "public/modules/**/*.js"
    ]
}
`}
      </pre>

      <p>
      A problem I ran into in using this was creating minified assets and bundling those together for the production environment. The MEAN.JS stack has a solution for your application assets, but for vendor assets, suggests including the same set of resources in production as in development. However, in production include the minified version of those vendor libraries instead of the full source. This means we're still making the same number of requests for vendor libraries, just for minified versions. Here's the assets from the <code>production.js</code> file:
      </p>

      <pre className="prettyprint">
{`assets: {
    lib: {
        css: [
            "public/lib/bootstrap/dist/css/bootstrap.min.css",
            "public/lib/bootstrap/dist/css/bootstrap-theme.min.css"
        ],
        js: [
            "public/lib/angular/angular.min.js",
            "public/lib/angular-resource/angular-resource.min.js",
            "public/lib/angular-ui-router/release/angular-ui-router.min.js"
        ]
    },
    css: "public/dist/application.min.css",
    js: "public/dist/application.min.js"
}
`}
      </pre>

      <p>
      CDN's are a possible solution to reduce bandwidth, but in the end this creates a more scattered set of assets to manage. What I would rather do is have a single file for vendor assets in the same way I have a single file for my source code. Additionally, Angular's very useful <a href="https://docs.angularjs.org/api/ng/service/$templateCache">template cache</a> can bundle all of our HTML templates into a single JavaScript file, and that can be minified and served up as well (which would mean we wouldn't have to make HTML requests from the client for each template after application load). What I would like is for my assets in the <code>production.js</code> file to look something like this:
      </p>

      <pre className="prettyprint">
{`assets: {
    lib: {
        css: "public/dist/vendor.min.css",
        js: "public/dist/vendor.min.js"
    },
    css: "public/dist/application.min.css",
    js: [
        "public/dist/application.min.js",
        "public/dist/templates.min.js"
    ]
}
`}
      </pre>

      <p>
      In the example above, you can see that all the vendor assets are now reduced to a single file (one for JavaScript, one for CSS), and the HTML templates are included in the <code>templates.min.js</code> file. (We could reduce this even further by concatenating these files together, but in this post we'll keep these set of files to make it easier to understand.)
      </p>

      <h2>The <code>build</code> Environment</h2>

      <p>
      We can solve this problem by introducing the <code>build</code> environment, and the associated <code>build.js</code> file. The intention here is to have a set of assets that are used when we run our build, and generate our production minified files. These assets are then almost a mirror of what's contained in the <code>all.js</code> file, but instead contain minified 3rd party libraries where possible. Doing this in conjunction with some additional build steps will provide us with the production assets we've described in the example above.
      </p>

      <p>
      So continuing with the same example set of assets, this would be the <code>build.js</code> file:
      </p>

      <pre className="prettyprint">
{`// Include the same assets from all.js, but for the vendor libraries (3rd party),
// include the minimized versions. These will not be minified during the build
// but instead concat together to form 1 vendor js file.
assets: {
    lib: {
        css: [
            "public/lib/bootstrap/dist/css/bootstrap.min.css",
            "public/lib/bootstrap/dist/css/bootstrap-theme.min.css"
        ],
        js: [
            "public/lib/angular/angular.min.js",
            "public/lib/angular-resource/angular-resource.min.js",
            "public/lib/angular-ui-router/release/angular-ui-router.min.js"
        ]
    },
    css: [
        "public/modules/**/css/*.css"
    ],
    js: [
        "public/config.js",
        "public/application.js",
        "public/modules/*/*.js",
        "public/modules/**/*.js"
    ]
}
`}
      </pre>

      <p>
      This file is basically a mix between the <code>all.js</code> file and the <code>production.js</code> file. The 3rd party vendor assets included are all minified versions (like the <code>production.js</code> file), while the application assets are all those contained within the project (like the <code>all.js</code> file).
      </p>

      <h2>Running the Build with Grunt</h2>

      <p>
      With the build file in place, we can turn our attention to the <code>Gruntfile.js</code> and add some additional tasks to generate our production assets. We'll do this by taking advantage of the <code><a href="https://github.com/ericclemmons/grunt-angular-templates">grunt-angular-templates</a></code>, <code><a href="grunt-contrib-uglify">grunt-contrib-uglify</a></code>, <code><a href="grunt-contrib-cssmin">grunt-contrib-cssmin</a></code>, and <code><a href="grunt-contrib-concat">grunt-contrib-concat</a></code> tasks.
      </p>

      <p>
      Before any of those tasks are executed, we need to setup a few things. First, we create another <code>env</code> task (in addition to the <code>test</code> environment) to setup the <code>build</code> environment:
      </p>

      <pre className="prettyprint">
{`env: {
    test: {
        NODE_ENV: "test"
    },
    build: {
        NODE_ENV: "build"
    }
}
`}
      </pre>

      <p>
      Within the <code>loadConfig</code> task we store off the assets we're going to work with (from the <code>build.js</code> file). Below is the updated <code>loadConfig</code>:
      </p>

      <pre className="prettyprint">
{`grunt.task.registerTask("loadConfig", "Task that loads the config into a grunt option.", function() {
    var init = require("./config/init")();
    var config = require("./config/config");

    grunt.config.set("vendorJavaScriptFiles", config.assets.lib.js);
    grunt.config.set("vendorCSSFiles", config.assets.lib.css);
    grunt.config.set("applicationJavaScriptFiles", config.assets.js);
    grunt.config.set("applicationCSSFiles", config.assets.css);
});
`}
      </pre>

      <p>
      Notice that we're storing the assets for both the vendor code as well as application code within these four variables. With that setup, we can run the <code>ngTemplates</code> task to package up all the HTML templates we have on the client side into a single <code>templates.js</code> file. The configuration for this task includes updating the URLs to use our <code>/assets</code> path, and assumes the Angular application module name is <code>my-app</code> for our application:
      </p>

      <pre className="prettyprint">
{`ngtemplates: {
    options: {
        htmlmin: {
            collapseWhitespace: true,
            removeComments: true
        },
        url: function(url) {
            return url.replace("public", "assets");
        },
        prefix: "/"
    },
    "my-app": {
        src: "public/modules/**/**.html",
        dest: "public/dist/templates.js"
    }
}
`}
      </pre>

      <p>
      Finally, we can uglify all our JavaScript, minify the CSS, and concat all those files together to form the assets needed by the production environment. The following shows the configuration for these three tasks:
      </p>

      <pre className="prettyprint">
{`uglify: {
    production: {
        options: {
            mangle: true,
            compress: false,
            sourceMap: true
        },
        files: {
            "public/dist/application.min.js": "<%= applicationJavaScriptFiles %>",
            "public/dist/templates.min.js": "public/dist/templates.js"
        }
    }
},
cssmin: {
    combine: {
        files: {
            "public/dist/application.min.css": "<%= applicationCSSFiles %>",
            "public/dist/vendor.min.css": "<%= vendorCSSFiles %>"
        }
    }
},
concat: {
    production: {
        options: {
            stripBanners: true
        },
        files: {
            "public/dist/vendor.min.js": "<%= vendorJavaScriptFiles %>"
        }
    }
}
`}
      </pre>

      <p>
      Notice that the <code>uglify</code> task will perform the operation on all application JavaScript files and separately on the <code>templates.js</code> to create the minfied versions. The <code>cssmin</code> task minifies the application and vendor CSS files separately, and the <code>concat</code> task lumps all the vendor's (pre-)minified assets together into one file (this avoids having to minify what should already be available in a minified version, from the vendor).
      </p>

      <p>
      With that all configured, we can wrap it all in a single Grunt <code>build</code> task:
      </p>

      <pre className="prettyprint">
{`grunt.registerTask("build", ["env:build", "loadConfig", "ngtemplates", "uglify", "cssmin", "concat"]);
`}
      </pre>

      <p>
      For a working example of this, please see my <a href="https://github.com/dylants/meanjs-template">meanjs-template project</a>, which takes advantage of this new <code>build</code> environment to create the production assets.
      </p>
    </section>
  );
}
