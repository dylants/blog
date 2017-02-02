import React from 'react';

import {
  generateDisplayTimestamp,
} from '../lib/posts';

import PostTitle from '../components/post-title/post-title.component';

const TITLE = 'Authenticated Model: A Strategy for Secure APIs in Backbone.js';
const TIMESTAMP = '20140213';
const DISPLAY_TIMESTAMP = generateDisplayTimestamp(TIMESTAMP);

export const config = {
  image: 'https://s3.amazonaws.com/dylants-blog/public/images/20140213/backbone_authentication.png',
  title: TITLE,
  timestamp: TIMESTAMP,
  displayTimestamp: DISPLAY_TIMESTAMP,
};

export default function Post() {
  return (
    <section className="post">
      <PostTitle title={TITLE} timestamp={DISPLAY_TIMESTAMP} />

      <p>
      As I've been using <a href="http://backbonejs.org/">Backbone</a> more and more to create web applications, I've found the need for a security pattern increasingly important. Early on perhaps most of your server side APIs are unsecure, requiring no sort of authentication to access the resources that they expose. But certainly there will be a set of resources at some point which require a layer of security to ensure that not just anyone can access, modify, or delete these resources. On the server side, <a href="http://nodejs.org/">Node</a> provides great libraries to handle this (such as <a href="http://passportjs.org/">Passport</a>), <a href="http://projects.spring.io/spring-security/">Spring dedicated an entire project to security</a>, but what about on the client side? I've gone through a couple iterations on how to handle this myself, and believe to have found a fairly easy and extensible way to manage this in Backbone applications.
      </p>

      <h2>AuthenticatedModel</h2>

      <p>
      In short, if the APIs are secure, the area which will be directly impacted by this is the Backbone Model. To me, it felt a bit awkward to have the logic handled by a router or a view when the model is the one directly communicating with the server. What we really want to do (in most cases) is check to see if the HTTP request is unauthorized (401 response code) and if so, redirect the user to the login page. With a couple of lines of code, we can extend the Model object and provide one which will do just that.
      </p>

      <p>
      Below is the code for the <code>AuthenticatedModel</code>. Note that I use <a href="http://www.requirejs.org/">require</a> for dependency management on the client side, which accounts for the funky define statement at the beginning (if you are unfamiliar with require).
      </p>

      <pre className="prettyprint">
{`/* global define:true */
define([
    "backbone"
], function(Backbone) {
    "use strict";

    /**
     * Wrap Backbone's error with our own, which handles unauthenticated response codes
     * and performs the necessary logic in this case (navigate to login page, perhaps)
     *
     * @param  {Object} options The options for the sync function
     */
    function wrapBackboneError(options) {
        var error = options.error;
        options.error = function(response) {
            if (response.status === 401) {
                // Add logic to send the user to the login page,
                // or general authentication page.
                //
                // In this example, we'll send the user to the "login" page:
                Backbone.history.navigate("login", {
                    trigger: true
                });
            } else {
                if (error) error(response);
            }
        };
    }

    // Extend Backbone's Model to override the sync function. Doing so allows us
    // to get a hook into how the errors are handled. Here we can check if the
    // response code is unauthorized, and if so, navigate to the login page
    return Backbone.Model.extend({
        sync: function(method, model, options) {
            wrapBackboneError(options);
            Backbone.Model.prototype.sync.apply(this, arguments);
        }
    });
});
`}
      </pre>

      <p>
      Ignoring the <code>wrapBackboneError</code> for a moment, you can see that this file is responsible for returning a Backbone Model, with one function modified: <code>sync</code>. Backbone calls this function during any HTTP request operation. It is here that we hook into Backbone's core logic to handle secure APIs. Within our new <code>sync</code> function, we first make a call <code>wrapBackboneError</code> which is defined above. The <code>sync</code> function then proceeds as normal, calling the original Backbone Model <code>sync</code> function.
      </p>

      <p>
      The <code>wrapBackboneError</code> function first holds on to the existing error function, and then defines a new one. This new error function checks to see if the response status code is 401 (unauthorized). If this is the case, we can send the user to the login page where they would hopefully, well, login to fix the problem. If the response code is something different, we handle the error as before (no changes). And of course if there are no errors, the operation will execute as it would normally without hitting any of this new logic.
      </p>

      <p>
      (Note: The same action could be taken for Backbone Collections as well, just simply replace the word "Model" with the word "Collection".)
      </p>

      <h2>Utilizing the AuthenticatedModel</h2>

      <p>
      With the <code>AuthenticatedModel</code> defined and available within our code, we can now extend that object rather than the original Backbone Model for our application. Below is another example which again uses <a href="http://www.requirejs.org/">require</a>:
      </p>

      <pre className="prettyprint">
{`/* global define:true */
define([
    "authenticated-model"
], function(AuthenticatedModel) {
    "use strict";

    return AuthenticatedModel.extend({
        urlRoot: "/api/secured-resource"
    });
});
`}
      </pre>

      <p>
      So now if an unauthenticated user was to access a page that uses the model above, a request would be made to "/api/secured-resource" to retrieve the model data. This request would return an unauthorized error code (401), which would be caught in our <code>AuthenticatedModel</code>, and the user would be redirected to the login page.
      </p>

    </section>
  );
}
