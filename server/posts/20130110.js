import React from 'react';

import {
  generateDisplayTimestamp,
} from '../lib/posts';

import PostTitle from '../components/post-title/post-title.component';

const TITLE = 'My introduction to Backbone.js (backbone-counter)';
const TIMESTAMP = '20130110';
const DISPLAY_TIMESTAMP = generateDisplayTimestamp(TIMESTAMP);

export const config = {
  image: 'https://s3.amazonaws.com/dylants-blog/public/images/20130110/backbone-counter.png',
  title: TITLE,
  timestamp: TIMESTAMP,
  displayTimestamp: DISPLAY_TIMESTAMP,
};

export default function Post() {
  return (
    <section className="post">
      <PostTitle config={config} />

      <p>
      My background is on the server side of things, but recently I've been heavily involved in the client side.  And one of the main players in that realm is <a href="http://backbonejs.org/">Backbone.js</a>.  For those who don't know, Backbone attempts to serve as a client side <a href="http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller">MVC framework</a> but really I believe is more of a library than a framework.  But I believe it's core logic is easy to understand, and not overwhelming for those getting into these client side MVC frameworks, which makes it easy to see why it's become so popular in the community.
      </p>

      <p>
      One of the main pain points I had early on with Backbone was the lack of a clear design strategy that I should take using the framework.  Because it's so easy to pick pieces of Backbone to use or not use, many in the industry seem to be doing very different things.  The <a href="http://backbonejs.org/">Backbone documentation</a> itself reviews the core concepts but doesn't really give you a step by step example of an application.  I turned to the (very much appreciated) <a href="http://addyosmani.github.com/todomvc/">TodoMVC</a> site for inspiration.  (TodoMVC is maintained by Addy Osmani and is an attempt to build the same "Todo App" using a different client side framework each time.)  However, even this can be a bit confusing at times...
      </p>

      <h2>Enter Counter App</h2>

      <p>
      I decided to create a very (very) simple counter application using Backbone to teach myself the framework.  I hoped this would also serve as a reference for a simple use of it if I needed that later.  The idea was to create an application that allows you to add and delete "counters" which themselves, just track a count.  This count can be incremented or decremented in isolation &mdash; meaning it doesn't affect the other counters.
      </p>

      <p>
      So my design was simple: create a page that shows a single "Add Counter" button, and once clicked, a new counter is displayed.  This counter initially displays a count of 0 and contains three actions: increment (+), decrement (-), and remove counter.  Clicking the + and - buttons will increase the count displayed by 1 or subtract by 1 respectively, and clicking the remove counter button will remove the counter from the page.  There's no limit on the count, number of counters, anything &mdash; let's just keep it simple, shall we?
      </p>

      <p>
      The end result can be viewed here: <a href="http://dylants.github.com/backbone-counter/">http://dylants.github.com/backbone-counter/</a>  Note that the code that I wrote in this repo represents my first introduction to Backbone, and I've learned a lot since, but am choosing here not to go back and change anything.  I hope this blog post can be used by others to understand Backbone a bit more.
      </p>

      <h2>MVC?</h2>

      <p>
      One of the hardest things for me to initially understand was how Backbone was MVC, or how it relates to things like <a href="http://www.springsource.org/">Spring MVC</a> or <a href="http://rubyonrails.org/">Rails</a>.  In the end, it's just easier to not, and instead focus on the model and view parts.  There is no "controller" (though some may say its taken by other parts of the framework) and the router is completely optional, and probably shouldn't be used initially (I would have liked someone to tell me that early on).  If you understand the model and view, you've got most all of Backbone.
      </p>

      <h2>AppView</h2>

      <p>
      One of the design patterns that I saw early on was the use of an AppView.  I've chosen to use this in the backbone-counter and other Backbone projects I've created since, and feel doing so makes Backbone easier.  Views in general are responsible for displaying the view (yes, I know, crazy right?), but also for part of the "C" in MVC.  They handle interactions on the page, and decide what to do with that action.  Personally I think it's easiest to manage a Backbone application if you have an AppView orchestrating the interactions of the application (in this case, the single page app).
      </p>

      <p>
      For the backbone-counter, the AppView is responsible for one thing: handling the click action to create a new counter.  It does this by registering the event within the "events" object a "click" action on the ID "add_counter".  We tell Backbone when this action takes place to call our "addCounter" function we've defined below.  This function creates a new counter model, creates a new counter view and passes this model to it, then asks the counter view to render itself and appends that to the HTML.
      </p>

      <pre className="prettyprint">
{`app.CounterAppView = Backbone.View.extend({

    el: '#counterapp',

    events: {
        'click #add_counter': 'addCounter'
    },

    initialize: function() {
    },

    render: function() {
    },

    addCounter: function() {
        var counter = new app.Counter();
        var view = new app.CounterView({ model: counter});
        $('#counters').append(view.render().el);
    }

});
`}
      </pre>

      <p>
      This pattern seems to be very common:
      </p>

      <ul>
        <li>Create a model</li>
        <li>Create a view, passing in the model</li>
        <li>Render the view and append it to our page</li>
      </ul>

      <p>
      In the code above you'll notice there's an initialize method and a render method which contain no code.  The initialize method is called when we new up the AppView, so we could put logic here we'd want to run on startup.  Render is called when we want to, well render, but again there's nothing for us to do here.
      </p>

      <p>
      The only thing left here is the "el" which tells Backbone where this view has authority.  This is an interesting thing to consider in Backbone, you limit the scope of the view based on where it exists in the DOM.  This helps to keep things separate in a page that may contain multiple views or applications.  In this case we're restraining this AppView to the HTML ID "counterapp".
      </p>

      <h2>CounterView</h2>

      <p>
      The CounterView represents the individual counter that is displayed on the page.  This view again is responsible for rendering but also for handling interactions which could possibly be thought of as a controller's responsibility.  The CounterView is responsible for three things: incrementing the counter, decrementing the counter, and removing the counter from the page.  We accomplish this in the same manner as the AppView, by registering events with user actions, but here we're interacting with a model rather than another view.
      </p>

      <pre className="prettyprint">
{`app.CounterView = Backbone.View.extend({

    // This is default, but just to be clear...
    tagName: 'div',

    // Cache the template function for a single item.
    template: _.template( $('#counter-template').html() ),

    events: {
        'click .increment': 'incrementCounter',
        'click .decrement': 'decrementCounter',
        'click .remove_counter': 'removeCounter'
    },

    initialize: function() {
        this.model.on( 'change', this.render, this );
        this.model.on( 'destroy', this.remove, this );
    },

    render: function() {
        this.$el.html( this.template( this.model.toJSON() ) );
        return this;
    },

    incrementCounter: function() {
        this.model.increment();
    },

    decrementCounter: function() {
        this.model.decrement();
    },

    removeCounter: function() {
        this.model.destroy();
    }

});
`}
      </pre>

      <p>
      Starting at the top, the tagName for this view is a div, which is the default but we're just being amazingly super clear.  In the AppView we specified "el" rather than "tagName", and this is one of the many areas that Backbone allows variation.  See the <a href="http://backbonejs.org/#View">Backbone documentation on views</a> for more information.
      </p>

      <p>
      The template tells Backbone where to find our compiled template which we when we render ourself.  Note that I'm using <a href="http://underscorejs.org/">Underscore</a> here, which not only plays nice with Backbone, but is very useful with or without a framework.
      </p>

      <p>
      The events should be familiar based on the AppView, but notice that the initialize and render functions have logic.  So when we new up this CounterView, the initialize function will relate to the model that any time the change event is fired, we should (re-)render this view.  And any time the destroy event is fired, we should remove this view (this is a Backbone supplied function).  For render, we follow a simple pattern:
      </p>

      <ul>
        <li>Request a JSON (read only object) representation of our model</li>
        <li>Pass this model to our compiled template</li>
        <li>Set the HTML of our element to this output</li>
        <li>Return this (our view) to the calling function (who is the AppView in this case)</li>
      </ul>

      <p>
      The increment, decrement, and removeCounter functions act on the model, calling the functions directly on it to perform the action.
      </p>

      <h2>Model</h2>

      <p>
      I'd argue that the best part of Backbone is the model, because of what it gives you in what you *don't* have to write.  Normally in any client side application you'd have some data model which contains information you obtain from the backend server.  Keeping this information in sync is the tricky part, and I'm sure many use <a href="http://api.jquery.com/jQuery.ajax/">jQuery's ajax</a> API to do most of this work.  If you need data, you perform a GET request to some resource.  Create a resource?  Use a POST.  Delete uses... guess?  That's right, a DELETE!  This is all part of <a href="http://en.wikipedia.org/wiki/REST#RESTful_web_services">REST</a> which if you don't already know, please read the <a href="http://en.wikipedia.org/wiki/REST">wikipedia article linked here</a>.
      </p>

      <p>
      As I was saying, the best part of Backbone is that it handles all of this for you!  You just construct a model and say save() and you've sent a POST request.  fetch() performs a GET, and destroy() performs a DELETE.  (PUT is performed with an existing model.save().)  What's critical here is to configure the URL to the resource, and make sure your backend is listening.  In the backbone-counter example there is no backend, because I don't require persistance, but configuring is a simple task.
      </p>

      <p>
      So, our counter model:
      </p>

      <pre className="prettyprint">
{`app.Counter = Backbone.Model.extend({

    defaults: {
        count: 0
    },

    increment: function() {
        this.save({
            count: this.get('count') + 1
        });
    },

    decrement: function() {
        this.save({
            count: this.get('count') - 1
        });
    }

});
`}
      </pre>

      <p>
      We use the defaults object to set default values of the counter model (which is just a JavaScript model in the end, so we could add anything we wanted to it later).  I've found keeping your contract clear here keeps things sane in the end, so you don't find yourself with random data floating around you're not expecting.  So list out all the values in the model here!
      </p>

      <p>
      The increment and decrement do almost the exact same thing, aside from the +/- sign.  To use the Backbone magic, Backbone must have a hook to know when values change.  So they ask that you use model.get("key")/model.set("key") rather than direct access.  This allows them to fire events when things change.  What I've done here is:
      </p>

      <ul>
        <li>Get the current value of the count</li>
        <li>Add/Subtract 1, setting this value as the count within this new object</li>
        <li>Saving this model, passing in the new object containing an updated count value</li>
      </ul>

      <p>
      This is a common pattern used to perform a set and save in one call.  You could simply do: <em>model.set("count", model.get("count) + 1); model.save();</em>  but I've done a save to avoid the need for the set.  The key takeaway here is that you perform actions on the model through getters and setters, and once done, perform a save() to persist.
      </p>

      <h2>Fire it up!</h2>

      <p>
      All that's left is to start the application.  I've chosen to do this within my router, but there's really no need to do it here.  In other projects, I've done it in the main, or app.js file (when using something like <a href="http://requirejs.org/">Require.js</a>).  I'm going to leave out the router here to avoid confusion, and it really does nothing in this backbone-counter.  It was an unneeded addition to the project, and probably unneeded in most projects (aside from those that require back-button support).
      </p>

      <pre className="prettyprint">
{`new app.CounterAppView();
`}
      </pre>

      <p>
      Once the AppView is newed up, it listens for clicks on the "Add Counter" button, and if clicked, creates a new CounterView, which listens for +/-/remove actions.
      </p>

      <p>
      For reference, here's the index.html page which is responsible for loading up Backbone and my application's JavaScript files.  It also contains the underscore template to keep things simple.
      </p>

      <pre className="prettyprint">
{`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>Backbone.js Counters</title>
</head>
<body>
    <div id="counterapp">
        <p>
            Backbone.js Counters
            <button id="add_counter">Add Counter</button>
        </p>
        <div id="counters"></div>
    </div>
    <script type="text/template" id="counter-template">
        <div class="counter">
            counter value: <%- count %>
            <button class='increment'>+</button>
            <button class='decrement'>-</button>
            <button class="remove_counter">Remove Counter</button>
        </div>
    </script>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.2/underscore-min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.2/backbone-min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/backbone-localstorage.js/1.0/backbone.localStorage-min.js"></script>
    <script src="js/models/counter.js"></script>
    <script src="js/views/counter.js"></script>
    <script src="js/views/counterapp.js"></script>
    <script src="js/routers/router.js"></script>
</body>
</html>
`}
      </pre>

      <h2>So, what do you think?</h2>

      <p>
      I actually really liked Backbone, once I got my head wrapped around how it does MVC.  Its lack of design direction hurts initially, but the huge adoption fills those gaps with the thousands of <a href="http://stackoverflow.com/questions/tagged/backbone.js">stackoverflow posts</a>.  I've played around with a couple of other client side MVC frameworks since trying out Backbone, and have come back to Backbone because it does everything I need, and doesn't try to do everything I don't need.  It's also really customizable, with the ability to override the various model methods (save, sync, etc), and very pluggable with the options to choose parts you want and parts you don't want (routers).
      </p>

      <p>
      Hope my stumblings help someone else :)
      </p>

    </section>
  );
}
