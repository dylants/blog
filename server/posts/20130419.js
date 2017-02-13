import React from 'react';

import {
  generateDisplayTimestamp,
} from '../lib/posts';

import PostTitle from '../components/post-title/post-title.component';

const TITLE = 'Backbone Revisited';
const TIMESTAMP = '20130419';
const DISPLAY_TIMESTAMP = generateDisplayTimestamp(TIMESTAMP);

export const config = {
  image: 'https://s3.amazonaws.com/dylants-blog/public/images/20130419/backbonejs.png',
  title: TITLE,
  timestamp: TIMESTAMP,
  displayTimestamp: DISPLAY_TIMESTAMP,
};

export default function Post() {
  return (
    <section className="post">
      <PostTitle title={TITLE} timestamp={DISPLAY_TIMESTAMP} />

      <p>
      In the Fall of last year, I picked up <a href="http://backbonejs.org/">Backbone.js</a> with the hopes of writing a couple front end applications to better understand how it worked.  The amount of differences between the client side MVC frameworks and those on the server side turned out to be enough to make me step back, and choose a entry point that would allow me to focus on the very basics of Backbone.  This helped me grasp the bare essentials of the framework, and <a href="/posts/20130110/my-introduction-to-backbone-js-backbone-counter">I wrote about my experiences in an earlier blog post</a>.  But the bare essentials can leave out important features of a framework that require a bit more digging and understanding.  Things that I would argue make this framework great.  So with all of that in mind I set out to write another app which (hopefully) illustrates some of these great features, and would like to go over them here.
      </p>

      <h2>App Overview: simple-todo</h2>

      <p>
      The main purpose of the application is to illustrate the features of Backbone, and for that I needed something that utilized <a href="https://en.wikipedia.org/wiki/Representational_state_transfer">REST</a> and contained a few "pages" which would allow me to use the router function of Backbone.  Also, having the ability to manipulate multiple sets of the same thing would allow me to explore collections of models.  So creating, editing, deleting multiple sets of things... how about another ToDo application?!  Couldn't hurt to have just one more of those out there, right?  But honestly, ToDo's are an easy thing for people to understand, and they fit into the model of GET/POST/PUT/DELETE pretty easily.  I chose to add "users" to the mix which would provide another login page, and separate out the ToDo's per each user.
      </p>

      <p>
      Backbone was obviously the front end framework, but for the backend, I chose <a href="http://nodejs.org/">Node.js</a>.  Really this could have been anything that serves up the JavaScript to run in the browser, and also responds on some REST endpoints.  But Node was fun to play around with, and did allow for an easier development environment in that it was all JavaScript.  Other minor points are that I used <a href="http://requirejs.org/">RequireJS</a> to help manage dependencies within the Backbone application, <a href="http://underscorejs.org/">Underscore.js</a> for the view templates, and a <a href="https://github.com/requirejs/text">RequireJS text plugin</a> to pull in those templates using Require.
      </p>

      <p>
      To see the full source of this application, head over to <a href="https://github.com/dylants/simple-todo">the GitHub repo</a>.
      </p>

      <h2>Backbone Router</h2>

      <p>
      Our application has multiple pages: one to display the login form, and another to display the list of ToDo's.  If a user is not logged in, they should see the login form.  Once logged in, the user would be sent to the list of ToDo's.  Because of this requirement, it makes sense to take advantage of <a href="http://backbonejs.org/#Router">Backbone's router</a>.  The router (in a Backbone application) is really only necessary if you want to modify the URLs in the address bar of the browser.  So really, if you have a true "single page application," then there is no need for the router.  Our application (purposely) needs two pages, so it makes sense in this case.
      </p>

      <p>
      The router is invoked based on different URL patterns, and for each can call a function.  This behavior easily lends itself to orchestrating your application's flow.  For our app, we must decide which page to send them to on the initial request.  If the user is logged in, they go to the list page to view their ToDo's.  If the user is not logged in, they go to the login page to authenticate.  To send them to a page, we invoke the route.  Backbone will automatically invoke the route on the initial request, but if we must internally invoke a route, we can use Backbone's navigate API.  This changes the URL, and if we send "trigger: true", it will also invoke our function.  Below is the code of the todo-router.js:
      </p>

      <pre className="prettyprint">
{`var TodoRouter = Backbone.Router.extend({
  routes: {
    "": "landing",
    "login": "login",
    "list": "list"
  },

  landing: function() {
    // our default behavior is to send them to the list page
    // which will determine if they have access to view the page
    this.navigate("list", { trigger: true });
  },

  login: function() {
    // render the login view
    appView.renderLogin();
  },

  list: function() {
    // make a GET request to session to determine if they're logged in
    $.get("/session").done(function(data) {
      if (data === "true") {
        // they are logged in, render the list view
        appView.renderList();
      } else {
        // they are not logged in
        // send them to the login page
        Backbone.history.navigate("login", { trigger: true });
      }
    }).fail(function() {
      console.error("failed to check status on session!");
      // send them to the login page
      Backbone.history.navigate("login", { trigger: true });
    });
  }
});
`}
      </pre>

      <p>
      In the code above, we make an HTTP GET request to "/session" to see if the user is logged in.  This was done to make sure users are logged in prior to viewing the list page.  In each function, when we're ready to render the page, we turn to the "appView" which handles the logic (this will be explained in detail below).  This keeps our router code rather clean and disconnected from specific view logic.
      </p>

      <h3>Wiring up our Router</h3>

      <p>
      With the router's logic complete, we must inform Backbone about it so that Backbone can route the flow to our code.  We do this by new'ing up our router followed by a call to Backbone.history.start.  The call to Backbone.history.start must be done after all routers have been instantiated so that Backbone is aware of each of them.  Remember that routers are not required for Backbone applications, but if used, they can become the top level of control in your application.  So when starting up your router to take requests, you're essentially starting up your entire application.  Because of this, the start should really be done in an onReady block of code, and only after you've loaded up all other parts of your application.  Below is the code within the todo-app.js, which when run, starts our application.
      </p>

      <pre className="prettyprint">
{`$(function() {
  // we must new up the TodoRouter before starting Backbone's history
  // because Backbone looks for any routers at start
  new TodoRouter();

  // load up Backbone's history, triggering the default route
  Backbone.history.start({
    silent: false
  });
});
`}
      </pre>

      <h2>Backbone Views</h2>

      <p>
      Backbone doesn't have a notion of "controllers" in a typical MVC paradigm, but instead just models and views.  This leads to developers moving the logic normally kept in the controller into the views (or specific business logic modules).  Each view in Backbone gets a scope, specified by the "el" property (which can be derived by the className, id, or other attributes).  The scope of the view determines the area of the page which the view owns and populates when it renders itself, and also where it listens for events which drive the logic of the application.  Normally a view is linked with a model or collection which it uses it displaying information specific to the user.
      </p>

      <h3>AppView</h3>

      <p>
      With that information in mind, it can be useful then to have a single application view which controls the entire scope of your app.  This "AppView" is responsible for initially setting up the entire application's view, meaning the individual views within the page along with the general UI found on all pages.  This pattern is often repeated within a Backbone application &mdash; a higher level view is responsible for initially setting up individual element views within an area of the page.  The higher level view manages finding the current set of views (GET), adding new views within that scope (POST), but the individual view manages editing (PUT) and deleting (DELETE) itself.  As you can see, the GET and POST responsibilities of a REST resource can then live in the higher level view, and the PUT and DELETE verbs exist in the individual view itself.
      </p>

      <p>
      Our AppView is responsible for managing the main views in our application: the login view and the list (of ToDo's) view.  It also is responsible for rendering the parts of the page that are common for both of those views (the header, footer, etc).  Focusing on the logic done for just those two views, we have the code shown below (from our app-view.js):
      </p>

      <pre className="prettyprint">
{`renderLogin: function() {
  var sessionModel, loginView;

  // first render this pag
  this.render();

  // set the page title
  document.title = "Simple Todo • Login";

  // render the header
  this.renderHeader("Simple Todo", false);

  // build up the login view and render it
  sessionModel = new SessionModel();
  loginView = new LoginView({
    model: sessionModel
  });
  loginView.render();
},

renderList: function() {
  var todoCollection, listView;

  // first render this page
  this.render();

  // set the page title
  document.title = "Simple Todo • List";

  // render the header
  this.renderHeader("Simple Todo", true);

  // build up the list view and render it
  todoCollection = new TodoCollection();
  listView = new ListView({
    collection: todoCollection
  });
  listView.render();
}
`}
      </pre>

      <p>
      The code above for renderLogin and renderList looks very similar in that both functions render the view for this page (the AppView) and then setup and render the header.  After that the two functions setup the model or collection for the view they must render, and render it.  We'll focus on the ListView within the renderList function.  Here we're doing a few things: new'ing up the TodoCollection, new'ing up the ListView passing that collection as an argument, and finally calling render on that view.  This is another common pattern seen for views.  Each view usually is connected with a model or collection, and the higher level view (or router in some cases) is responsible for constructing that model or collection and passing it to the view, which it will use when asked to render itself.  Let's look closer at the ListView.
      </p>

      <h3>ListView</h3>

      <p>
      The purpose of our list page is to display the user's current ToDo's, allow them to add additional ToDo's, edit existing ToDo's, and delete ToDo's they have completed.  We've broken that down in a way that fits into the Backbone architecture.  We have an outer ListView which is responsible for managing the individual TodoItemView's (which will be explained later).  The ListView gets the current set of ToDo's as a collection (passed in from the AppView) and uses that to initially populate the page.  The ListView also must listen to a click event initiated by the user to add a ToDo, and when fired, create a new ToDo from the values specified by the user.
      </p>

      <p>
      Instead of showing the full source of the ListView, I'd rather focus on a couple key areas that relate to how the ListView processes adding a new ToDo.  Let's look at the code from list-view.js:
      </p>

      <pre className="prettyprint">
{`...

initialize: function() {
  // bind the sync on the collection with rendering this view
  this.collection.on( "sync", this.render, this );
},

...

addTodo: function(event) {

  ...

  // create a new todo model
  todoModel = new TodoModel({
    content: todoContent
  });

  // add it to our collection
  this.collection.add(todoModel);

  // save the new todo to our backend
  // note: we do not need to save our entire collection here,
  // but just the single todo. This is because the backend
  // database links the user to the collection of todos, so it
  // will automatically handle adding it to the right collection
  todoModel.save();
}

...
`}
      </pre>

      <p>
      In the initialize function, we state we should bind the "sync" event (when fired on our collection) to the render function.  Backbone fires a sync event if it must update a model.  An update operation is a POST, PUT, or DELETE HTTP request.  So a sync event is fired when a model is created, edited, or deleted.  By binding that event to render, we're stating that anytime our collection of ToDo's is updated, we should re-render our list.  This is a useful pattern to apply to keep the page up to date with the latest data.
      </p>

      <h3>TodoItemView</h3>

      <p>
      The TodoItemView represents a single ToDo.  The view is responsible for the area of the page that contains the ToDo, and because of that, is responsible for editing the ToDo and deleting the ToDo (the PUT and DELETE operations).  As with the ListView, instead of looking at the entire source, let's focus on areas related to those actions.  Below is code from todo-item-view.js:
      </p>

      <pre className="prettyprint">
{`...

initialize: function() {
  this.model.on( "sync", this.render, this );
  this.model.on( "destroy", this.remove, this );
},

...

editTodo: function() {

  ...

  this.model.set("content", todoContent);
  this.model.save();
},

deleteTodo: function() {

  ...

  // destroy calls delete on the backend, deleting it from the database
  this.model.destroy();
}

...
`}
      </pre>

      <p>
      In the initialize function, as with the ListView, we bind the "sync" event (when fired on the model) to the render function.  This is necessary here because within the editTodo function we update the model's data with the new content, and call save on the model.  This causes Backbone to perform a PUT request to update the existing ToDo, and fires the sync event.  In addition, we bind the  "destroy" event (when fired on the model) to the remove function.  When the deleteTodo function is called, we call this.model.destroy() which performs a DELETE operation removing the ToDo from the backend, and fires a destroy event.  You'll note the remove function is not defined in our code, but instead within Backbone itself (which will remove the model from the collection).
      </p>

      <h2>Backbone Collections and Models</h2>

      <p>
      The final piece of Backbone we'll discuss is collections and models.  This is really where I believe Backbone provides the most support to a client side application developer.  Once you setup your collection or model, Backbone provides functions which allow you to easily sync the data between the frontend and backend, eliminating the need for a lot of Ajax operations throughout your code.  Multiple models usually exist within a collection, although you can have a single model represent things that can not be duplicated (in the simple-todo application, a "session" resource is modeled in such a way).
      </p>

      <p>
      Note that to use the REST operations provided by Backbone, you must setup either <a href="https://developer.mozilla.org/en-US/docs/DOM/Storage">client side storage</a> or REST endpoints on the server side.  In the simple-todo application, Node serves the REST endpoints for the Backbone application.  Information on the server setup is not part of this post, but the <a href="https://github.com/dylants/simple-todo">full source of this application is available in GitHub</a>.
      </p>

      <h3>TodoCollection</h3>

      <p>
      There can be multiple ToDo's for each user in our application.  Because of that, it's natural for us to use Backbone's collection object to represent the complete set of ToDo's for a given user.  The individual ToDo is represented by the TodoModel (described below).  Setting up a collection is fairly straightforward.  There are only a few variables that need to be configured, and optional functions to provide.  Below is the source of todo-collection.js:
      </p>

      <pre className="prettyprint">
{`return Backbone.Collection.extend({
  url: "/todo",

  model: TodoModel,

  initialize: function() {
    // load the list data for this user
    this.fetch();
  }
});
`}
      </pre>

      <p>
      The code above first states that the URL to the resource on the backend is found at "/todo".  This means that the REST verbs work off that URL.  So to retrieve the complete set of ToDo's, one would send a GET request to /todo.  To update a single ToDo, one would send a PUT request to /todo/[id], and so forth.  By stating the URL we're simply providing the base URL value which Backbone will use when constructing the REST requests.
      </p>

      <p>
      The code also states that the model which will be used by this collection is the TodoModel (described below).  Additionally, the initialize function is provided so that when we new up a TodoCollection, we'll perform a GET request to load the ToDo's that currently exist for this user.  We do this by performing a "fetch()" operation on this collection. <a href="http://backbonejs.org/#Collection">More information on Backbone collections can be found in the documentation</a>.
      </p>

      <h3>TodoModel</h3>

      <p>
      Now that we have our collection, the next step is to configure our model for the ToDo.  In the model, we state the attributes that make up a single ToDo.  Below is the code from todo-model.js:
      </p>

      <pre className="prettyprint">
{`return Backbone.Model.extend({
  defaults: {
    id: null,
    content: ""
  }
});
`}
      </pre>

      <p>
      As you can see, there's not much to a model (if contained within a collection).  The defaults object allows us to state the default values of a given model.  This helps in documenting what we expect each model of this type to look like.  Each REST resource has a unique ID, and Backbone relies on this fact throughout the code.  Because of that, we've stated that this model (like every model) has an ID.  We've also stated that this model has content &mdash; the value of the ToDo.  Default values are provided here, but they will be overridden when the model is populated with data from the backend.
      </p>

      <p>
      If we're creating a new model on the frontend (as we do with addTodo in the ListView), we specify the ToDo's content but not an ID.  This is important in Backbone, since it relies on new models that have not yet been persisted to not yet have an ID.  This fact is used when deciding between making a POST request (creating a ToDo) and a PUT request (updating an existing ToDo).  Once the POST request is made, the model will have a populated ID, which means it has been saved to the backend.
      </p>

      <h3>The Importance of a Model</h3>

      <p>
      We're ending the overview here with the model, but keep in mind that models are probably the most essential part of the application.  In the end, the model is just a representation of a <a href="http://en.wikipedia.org/wiki/Web_resource">resource</a>, but deciding what those resources are and how you go about exposing the details of your application are both very important.  When designing a new app, spending the time up front to really make sure the resources are constructed correctly will make everything else that much easier.  And once that's done, the models will fit right into place.  All that to say, I've written this from a top down perspective, but really designed it initially from the bottom up (which I'd recommend).
      </p>

      <h2>In Summary</h2>

      <p>
      Backbone has always been a framework that tries to provide just enough components and tooling to allow you to build your web application, but not burden you with forced requirements and structure. Granted there are a few patterns that are more "Backboney" than others, but Backbone by no means handles all the application development for you. <a href="http://backbonejs.org/">Documentation on the Backbone site</a> really just provides an API doc, but no true getting started guides or design pattern suggestions.  This I think reflects what the developers of Backbone wanted &mdash; a library of components that can be used in any way the developer wishes.  You can use a router, or choose to avoid it.  You can allow your views to handle all business logic, or choose to have outside modules drive the logic.  Indeed the options are varied, but I believe this provides users with great flexibility <em>which is a good thing!</em>  All web applications are not the same, so why should the design be the same?  By providing simple, reusable components, Backbone has established itself as a framework that most anyone can use in most any situation.  And as I look at other options for client side MVC, I keep coming back to Backbone as my choice of frameworks to build rich client web applications.
      </p>

    </section>
  );
}
