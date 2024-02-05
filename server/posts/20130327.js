import React from 'react';

import {
  generateDisplayTimestamp,
} from '../lib/posts';

import PostTitle from '../components/post-title/post-title.component';

const TITLE = 'Hot Embers? First Take at Ember.js (ember-counter)';
const TIMESTAMP = '20130327';
const DISPLAY_TIMESTAMP = generateDisplayTimestamp(TIMESTAMP);

export const config = {
  image: 'https://s3.amazonaws.com/dylants-blog/public/images/20130327/emberjs-logo.png',
  title: TITLE,
  timestamp: TIMESTAMP,
  displayTimestamp: DISPLAY_TIMESTAMP,
};

export default function Post() {
  return (
    <section className="post">
      <PostTitle config={config} />

      <p>
      I've been keeping track of <a href="http://emberjs.com/">Ember.js</a> for a while now, and from what the creators have been saying about the technology, it's hard not to if its <a href="http://net.tutsplus.com/articles/interviews/ember-js-core-team-interview/">truly going to be as good of a solution as they've claimed</a>.  Right out of the gate, Ember stresses its a full "top-to-bottom" solution that will address all the edge cases and design needs other frameworks have failed to cover.  And with the current 1.0 release of <a href="http://backbonejs.org/">Backbone.js</a> coming in at <a href="http://backbonejs.org/backbone-min.js">6.3k (minified)</a>, Ember's roughly 8 times larger <a href="https://raw.github.com/emberjs/ember.js/release-builds/ember-1.0.0-rc.1.min.js">49k (minified)</a> package leads one to believe there surely must be so much more to this new (not so little) framework.
      </p>

      <p>
      Yes, Ember gives you a ton of function.  It starts by telling you what to do, where to put your files, how to build your application.  This is quite a difference from Backbone which hopes to stay out of your way, but may be something Rails folks welcome.  Ember also gives you "real" controllers (though the routers seem to be more of a controller than the controllers), an <a href="http://emberjs.com/guides/object-model/classes-and-instances/">amazing object model complete with computed bindings</a>, and a host of other things.  I think the question most developers will need to ask themselves is if they need this extra tooling.  If you feel as though frameworks such as Backbone (or maybe a more difficult sell &mdash; the <a href="http://angularjs.org/">Angular.js</a> crowd) don't fill your needs, or you feel you're writing too much code in your frontend applications, Ember might just be the perfect solution.  At the same time, if you feel as though your current framework is suitable for your needs, Ember might come across as a bit too much.
      </p>

      <h2>Pieces of Ember</h2>

      <p>
      To effectively use Ember (or really use it at all), you'll need three main dependencies.  First, and probably most obvious, is ember itself. <a href="http://emberjs.com/guides/templates/handlebars-basics">Ember stresses early on the use of templates,</a> and with the developers of Ember also partly the same as those who built <a href="http://handlebarsjs.com/">Handlebars</a>, it makes sense that they require that as a dependency as well.  The final piece (<a href="https://github.com/emberjs/data#is-it-production-ready">and at the time of this writing, the most unstable</a>) is ember-data.  The choice to make this a separate piece outside of the main function was interesting.  It did allow the developers to focus on the core of ember to begin with, but with it being such an integral piece of ember, really is necessary if you require persistance at all.
      </p>

      <p>
      As an aside, jQuery is also a dependency (but is almost a dependency of any web app).  Also, if you need a local storage solution aside from what ember-data provides, you might need to include it in your projects dependencies.  I chose to use one developed for the todo mvc application, <a href="https://raw.github.com/addyosmani/todomvc/gh-pages/architecture-examples/emberjs/components/ember-localstorage-adapter/localstorage_adapter.js">which you can find here</a>.
      </p>

      <h2>A simple task for Ember: ember-counter</h2>

      <p>
      I set out to build a simple application using Ember to get an idea on how it worked.  The <a href="http://emberjs.com/guides/">guides</a> and <a href="http://todomvc.com/">TodoMVC application</a> can be useful up to a point, but you really need to develop something with the framework to understand it.  For that task, I chose to stick to my counter application. <a href="/posts/20130110/my-introduction-to-backbone-js-backbone-counter">I've developed a similar application using Backbone.js</a> and found it helpful when getting started.  You can find the <a href="https://github.com/dylants/ember-counter">source of the ember-counter application here</a> (which I'll go over in detail below), <a href="http://dylants.github.com/ember-counter/">and a running instance of the app here</a>.
      </p>

      <p>
      The idea is simple: I'd like the counter application to display a list of counters.  I want to be able to dynamically add and remove counters from the page.  And each counter should independently keep track of it's count, which I should be able to increment and decrement.  And that's it.  Simple.
      </p>

      <h2>Start from the top, the Ember application</h2>

      <p>
      This app is simple, right?  So we'll just use an index.html file to host the app, and also manually specify each dependency as a script include.  I've described the ember dependencies above, and this file also includes each file in my ember-counter application.  (The other main responsibility of this index.html file is to include the handlebars template, which we'll go over later.)  But the first app-specific dependency I include is my app.js:
      </p>

      <pre className="prettyprint">
{`/**
 * Defines the CounterApp, an Ember Application
 *
 */
window.CounterApp = Ember.Application.create();
`}
      </pre>

      <p>
      These few lines of code do a great deal of things.  First they setup the namespace of your application, in this case, the CounterApp.  Whenever we need to create anything for this application, be it a model, controller, router, etc, we'll reference this CounterApp which allows Ember to keep track of each application separately.  It also sets up eventing, optionally renders the application template (not used in this application), and starts routing. <a href="http://emberjs.com/guides/application/">More information on the Ember application can be found in the guides</a>.
      </p>

      <p>
      So you can begin to see that Ember really is trying to take care of so much for you without you having to write much code.  This highlights the power of Ember.
      </p>

      <h2>Router</h2>

      <p>
      Aside from the app, I'd say the most critical part of your application lies in the router.  Normal routers in Spring or Rails simply send requests to some controller.  But Ember routers do much more, almost taking on the role of controllers themselves.  This was confusing to me at first, <a href="http://wekeroad.com/2013/03/06/ember-confuses-me">and probably still is most of the confusion for people out there</a>, but something you'll just have to get used to.
      </p>

      <p>
      The router can help populate the model, setup the controller, and even help in rendering views. <a href="http://emberjs.com/guides/routing/">You'll find more information in the router guide</a>, but its definitely interesting to me how much the router can own, and how the designers want to keep the controllers very (very) thin with little responsibility.  For our ember-counter application, we need to first define that the "/" route (for our index page) is meant for our counters resource.  In addition, we'll need to define the model used in the route we've established:
      </p>

      <pre className="prettyprint">
{`/**
 * Defines the router for our application, mapping paths to resources and/or routes
 */
CounterApp.Router.map(function() {
  // by stating this, ember will point to our CountersRoute below when a
  // request is sent to "/", and use the CountersController and counters template
  this.route("counters", { path: "/" });
});

/**
 * Used when a request is sent to the route matched by any counter path
 *
 */
CounterApp.CountersRoute = Ember.Route.extend({
  // Define the model which is the collection of counters found through
  // the CounterApp.Counter model object
  model: function() {
    return CounterApp.Counter.find();
  }
});
`}
      </pre>

      <p>
      Most of this gets easier to understand the more you see it.  The CounterApp.Router (notice we're using the CounterApp namespace) defines the router for our application.  This maps resources or routes to URLs.  We've specified the "counters" route and below the "CounterApp.CountersRoute".  Note the plural "counters" used in both, which is <strong>very important</strong>.  The magic of Ember is lost when you miss a letter here or there, and without any checking built into Ember, things just silently fail, which can drive you a bit insane.  I guess the only advise I can give is to double check every word when things go wrong, because they will at some point.
      </p>

      <p>
      Anyway, CountersRoute sets up the model.  Here we're using the CounterApp.Counter model (which we've yet to go over), and a built in ember-data function "find()" which as you can imagine, finds all records of this model in our backend.  So with this we're stating the CounterRoute should have a model which contains a list of all our Counters.  Let's talk about those Counter models, shall we?
      </p>

      <h2>Ember Models (ember-data)</h2>

      <p>
      So its here at the models where things start to break down a little if you dig too deep.  Ember-data is still relatively new and a bit unstable, but works for most needs. <a href="https://github.com/emberjs/data#is-it-production-ready">The ember-data guide states that it's not production ready</a>, and has a weird disconnected vibe from the main ember source (sometimes included in the ember docs, other times we need to reference the ember-data github's readme).  Overall, this just doesn't have that polished feel, but it is still rather early in the life of Ember.  Hopefully things will all be worked out in the end.
      </p>

      <p>
      To me what's unexpected is that out of the box, the models you build will make REST service calls to a backend.  So with nothing else configured, you'll get HTTP request errors in your app. I configured a local storage adapter to work around that because I didn't need a backend, but it's just unusual to get automatic REST.  I'm not saying it's bad &mdash; I actually found the difference kinda cool.
      </p>

      <p>
      Our counter model needs two things: a DS.Model and a DS.Store.  The model is backed by the store, so both must exist.  Think of the store as the internals of how the model communicates to store its information, and the model as an abstraction of just the data we need to relate with.  So first the counter model, which contains a single attribute "count":
      </p>

      <pre className="prettyprint">
{`/**
 * Defines a model which holds data for the counter, backed by the store
 *
 */
CounterApp.Counter = DS.Model.extend({
  // our count attribute is a number
  count: DS.attr("number")
});
`}
      </pre>

      <p>
      And the counter store, which specifies an ember-data revision (for non-backwards compatible changes in ember-data) as well as our local storage adapter to use instead of REST backend calls.
      </p>

      <pre className="prettyprint">
{`/**
 * This is our hook required to store data within the models
 *
 */
CounterApp.Store = DS.Store.extend({
  // this sets the revision of the DS.Store (which allows notifications on changes)
  revision: 12,
  // we're using a Local Storage rather than the default REST adapter
  adapter: "CounterApp.LSAdapter"
});

/**
 * Defines the Local Storage adapter for our counter app
 *
 */
CounterApp.LSAdapter = DS.LSAdapter.extend({
  // namespace for the counter app within the local storage
  namespace: "counterapp-emberjs"
});
`}
      </pre>

      <p>
      With these two things defined, we move on to the controllers.
      </p>

      <h2>Controllers</h2>

      <p>
      So in our CounterApp.Router we specified "counters", remember?  Again, that word is <strong>very important</strong>.  It affects all parts of our application, and if there are any changes to that word, everything else must change as well.  For our controller, we must specify CounterApp.CountersController to get picked up in the Ember flow.  Reviewing our design, this controller is responsible for adding new counters to the page.  It does not need to handle incrementing, decrementing, or removing an individual counter (that'll be the job of another controller).  Because it oversees multiple models (counters), we'll use an Ember.ArrayController:
      </p>

      <pre className="prettyprint">
{`/**
 * This controller represents an array of counters, and provides methods
 * outside of a single counter but instead for the collection
 *
 */
CounterApp.CountersController = Ember.ArrayController.extend({
  createCounter: function() {
    // create a counter using ember data's create record
    // initially set the count to 0
    CounterApp.Counter.createRecord({
      count: 0
    });

    // any time we modify the models, we must commit the changes
    // to the backend store
    this.get("store").commit();
  }
});
`}
      </pre>

      <p>
      Our CounterApp.CountersController has one method, createCounter.  This function creates a new counter model, using the rather clunky syntax shown above.  First create a record (counter object), then get the backing store and commit the changes.  I'd rather the abstraction continue here and we don't have to know about the store, but that's a minor gripe.  Perhaps once ember-data is finalized they'll change this pattern.
      </p>

      <p>
      As for the individual counter controller, we'll use an Ember.ObjectController since it's only dealing with one model to create the CounterApp.CounterController:
      </p>

      <pre className="prettyprint">
{`/**
 * This provides functions for an individual counter (or object)
 *
 * @type {Ember.ObjectController}
 */
CounterApp.CounterController = Ember.ObjectController.extend({
  increment: function() {
    // the model here is our counter
    var counter = this.get("model");
    // increment the count value by 1
    counter.set("count", counter.get("count") + 1);
    // any time we modify a model, we must commit the changes
    // to the backend store
    counter.get("store").commit();
  },

  decrement: function() {
    // the model here is our counter
    var counter = this.get("model");
    // decrement the count by 1
    counter.set("count", counter.get("count") - 1);
    // any time we modify a model, we must commit the changes
    // to the backend store
    counter.get("store").commit();
  },

  removeCounter: function() {
    // the model here is our counter
    var counter = this.get("model");
    // deleting the record will cause ember-data to remove this counter
    counter.deleteRecord();
    // any time we modify a model, we must commit the changes
    // to the backend store
    counter.get("store").commit();
  }
});
`}
      </pre>

      <p>
      This controller has methods to increment, decrement, and remove the counter from view.  Here again we have the same pattern as above, we're we must perform an operation then commit the store.
      </p>

      <h2>Let's see it: The View</h2>

      <p>
      The final piece of this application is the view.  Ember uses Handlebars, so our view is a handlebars template.  Because this application is rather simple, our template is stored in the index.html page itself.  Remember that <strong>very important</strong> "counters" route in our CounterApp.Router?  Well it's important here as well!  Our template name must match that route.  This counters template will be shown then when a request hits the "/" URL, and the CountersController owns that whole view.  We've iterated over the models in the template, linking each one with a CounterController to handle the increment, decrement, and remove operations.
      </p>

      <pre className="prettyprint">
{`<script type="text/x-handlebars" data-template-name="counters">
  <div id="counterapp">
    <p>
      Ember.js Counters
      <button {{action "createCounter"}}>Add Counter</button>
    </p>
    <div id="counters">
      {{#each model itemController="counter"}}
        <div class="counter">
          counter value: {{count}}
          <button {{action "increment"}}>+</button>
          <button {{action "decrement"}}>-</button>
          <button {{action "removeCounter"}}>Remove Counter</button>
        </div>
      {{/each}}
    </div>
  </div>
</script>
`}
      </pre>

      <p>
      Handlebars of course uses that {'{{ }}'} syntax to specify logic, and we're using that here to link actions to the controllers (createCounter, increment, decrement, etc).  We also use the "each" method to loop over the model (which we specified in the router, remember?) and also grab the models "count" attribute to display on the screen.
      </p>

      <h2>Opinion?</h2>

      <p>
      So this was obviously not the intended use case of Ember when the developers set out to design it.  They wanted to take on those huge web applications that had tons of duplicate code with crazy hacks to get things working.  They're trying to be the more mature JavaScript MVC framework out there.  But as with anything, start with the core concepts in a simple environment, remove all other variables, and you can learn a lot.
      </p>

      <p>
      And I think I did.  Working through this application, which I thought would be really easy to implement, taught me that Ember requires discipline.  It requires that you understand the finer details of the framework and how things are interconnected.  The "very important" counters theme that I had running through the above sections hints at some frustration I had going through it.  The problem with things that want to be "magic" to end users is when things go wrong, we often have little to no way of knowing why.  I often found myself cracking open the source, debugging through it (which because of its size, caused issues with Chrome's syntax highlighting).  Once I'm doing that, much of it's simple to use advertisements go away.
      </p>

      <p>
      And others seem to feel this way too. <a href="http://discuss.emberjs.com/t/getting-started-with-ember-js-is-easy-no-it-isn-t/559/2">Many threads like this one here</a> can be found online, and the developers know it (see <a href="http://emberjs.com/blog/2013/03/21/making-ember-easier.html">this</a> and <a href="https://twitter.com/tomdale/status/315168093632614400">this</a>).  Hopefully with more guides, more tutorials, and more general use of Ember things will get easier.  But make no mistake about it, this is a much more involved framework than most are used to in the JavaScript community, and probably intimidates most.  Backbone is simple.  It's simple to understand and simple to use because it doesn't do much.  Ember does a ton of things.  And knowing how to use those things correctly and even what all those things are is a whole issue in itself.
      </p>

      <p>
      But all of this will smooth over and go away as more people adapt the framework and more knowledge is shared.  Until then, I guess we'll have to wait an see how the community embraces Ember, and if they truly can make it as simple and powerful as we all want it to be.
      </p>

    </section>
  );
}
