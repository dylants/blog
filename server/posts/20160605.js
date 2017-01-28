import React from 'react';

import {
  generateSample,
  generateDisplayTimestamp,
} from '../lib/posts';

import PostTitle from '../components/post-title/post-title.component';

const TITLE = 'Components, Containers, and Test Apps';
const TIMESTAMP = '20160605';
const DISPLAY_TIMESTAMP = generateDisplayTimestamp(TIMESTAMP);

export const config = {
  image: 'https://s3.amazonaws.com/dylants-blog/public/images/20160605/components_containers_test_app.png',
  title: TITLE,
  timestamp: TIMESTAMP,
  displayTimestamp: DISPLAY_TIMESTAMP,
  sample: generateSample('Web components aren’t exactly new, but their use is becoming more widely accepted. We’re no longer building pages with controllers and views that mix and match assets together, but rather seeing reusable components that separate pages share. Web developers are now being trained to draw boxes around parts of a page to build a sort of “Russian Doll” set of components. The idea of a component library for a suite of web applications is becoming easier to build, especially now that client side libraries and frameworks such as React and Angular 2 have positioned themselves to make components a first class citizen. '),
};

export default function Post() {
  return (
    <section className="post">
      <PostTitle title={TITLE} timestamp={DISPLAY_TIMESTAMP} />
      <p>
      Web components aren't exactly new, but their use is becoming more widely accepted.  We're no longer building pages with controllers and views that mix and match assets together, but rather seeing reusable components that separate pages share.  Web developers are now being trained to draw boxes around parts of a page to build a sort of "Russian Doll" set of components.  The idea of a component library for a suite of web applications is becoming easier to build, especially now that client side libraries and frameworks such as <a href="https://facebook.github.io/react/">React</a> and <a href="https://angular.io/">Angular 2</a> have positioned themselves to make components a first class citizen.
      </p>

      <p>
      In this world of web components, it's useful to adhere to some general guidelines which can help in building applications that can easily be demonstrated, restructured, and maintained.  In this post, I'd like to speak about a few of those things that I've found useful.  One is passing containers to child components, and the other is building a test application for your components inside the existing application.
      </p>

      <h2>Passing Containers to Child Components</h2>

      <p>
      <a href="https://www.youtube.com/watch?v=KYzlpRvWZ6c">Many</a> <a href="https://medium.com/@learnreact/container-components-c0e67432e005">have</a> <a href="https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0">suggested</a> when building web components to make sure to separate out the component into a "dumb" or "presentation" component and a "smart" or "container" component.  The presentation component simply renders.  It takes in data that is necessary to render and displays it in an appropriate fashion.  Any actions that occur through user interaction are passed to the presentation component as callbacks.  The presentation component has no idea where the data comes from, nor does it really care.  Each presentation component is then wrapped by a container component, or what I'll refer to as simply a "container".  The container is responsible for loading the data for the component, and also supplying it with any action functions that should occur based on user interaction.
      </p>

      <p>
      With this model, each web component is a pairing of a container and a (presentation) component.  The presentation component can be reused across the application, or in other applications -- it simply renders some data.  The container generally has no styling or specific rendering of it's own, it only renders the component.  The container's responsibility is to load the data and/or actions specific to where the component exists in the application.
      </p>

      <p>
      So what happens if one component needs to render other components?  In the world of container/component pairing, does the component then render a container?  But if it does so, the component (which should be "dumb" if you remember) has an indirect understanding of the data which should be used.  One possible solution to solve this problem is to pass the container to render as input to the presentation component, so the component can still render a container, but has no knowledge of what specific container it is rendering.
      </p>

      <p>
      An example may be useful to explain:
      </p>

      <h3>Example: Widgets and Wockets</h3>

      <p>
      <i>Note that the below code examples use React, but the same ideas can be applied to Angular 2 or other similar frameworks/libraries.</i>
      </p>

      <p>
      Let's say we are handed a design that includes a page which lists "widgets" and a page that lists "wockets".  The design for both of these pages is very similar, and includes the following requirements:
        <ul>
          <li>Each page will load the initial set of widgets or wockets.</li>
          <li>The user can load additional widgets or wockets if they choose by clicking the "load more" button.</li>
          <li>The user can delete a widget or wocket by clicking the "x" button at the top of the widget or wocket.</li>
        </ul>
      </p>

      <img src="https://s3.amazonaws.com/dylants-blog/public/images/20160605/widgets_and_wockets.png" alt="" />

      <p>
      Okay, well this seems simple enough.  Since the widget and wocket items are displayed so similarly, we can share the same components between them.  From the design, it looks like we need two components.  We need a list component to display the items in a list and include the "load more" button at the bottom.  We also need an item component to display the individual widget and wocket items, along with the "delete" button at the top right.  Doing this allows us to share the two components, the only difference being the containers that need to load the data for the list, and perform the actions ("load more" for the list component, "delete" for the item component).
      </p>

      <p>
      Without any containers, we can imagine our components to look something like this:
      </p>

      <pre className="prettyprint">
{`function ListComponent(props) {
  const { items } = props;

  const itemsToRender = items.map(item =>
    <ItemComponent key={item.id} {...item} />
  );

  // render the items...
}

function ItemComponent() {
  // render the item...
}
`}
      </pre>

      <p>
      But each component should be wrapped in a container, so that the container can pass in the data and/or functionality that it needs.  We can easily wrap the <code>ListComponent</code> with a <code>WidgetListContainer</code> and <code>WocketListContainer</code>.  The problem arrises once we try to wrap the <code>ItemComponent</code> with a <code>WidgetItemContainer</code> and <code>WocketItemContainer</code>:
      </p>

      <pre className="prettyprint">
{`function ListComponent(props) {
  const { items } = props;

  const itemsToRender = items.map(item =>
    // WidgetItemContainer or WocketItemContainer??
  );

  // ...
`}
      </pre>

      <p>
      The list component is responsible for rendering an item component, that is clear.  The confusion lies in which type of item component it should render.  By choosing one type, and therefore a specific container, we're binding the component to a container and indirectly to the data and action implementations.  Even if we only had widgets and no wockets to worry about, since we're wrapping each component with a container we'd still be linking the list component to the widget container.
      </p>

      <p>
      Let's avoid all this by passing the container that we should render.  So the <code>WidgetListContainer</code> would pass the <code>WidgetItemContainer</code>, and the <code>WocketListContainer</code> would pass the <code>WocketItemContainer</code>:
      </p>

      <pre className="prettyprint">
{`function WidgetListContainer() {
  // gather widget items...

  return (
    <ListComponent
      items={widgetItems}
      ItemContainer={WidgetItemContainer}
    />
  );
}

function WocketListContainer() {
  // gather wocket items...

  return (
    <ListComponent
      items={wocketItems}
      ItemContainer={WocketItemContainer}
    />
  );
}

function ListComponent(props) {
  const { items, ItemContainer } = props;

  const itemsToRender = items.map(item =>
    <ItemContainer key={item.id} {...item} />
  );

  // ...
`}
      </pre>

      <p>
      Doing this keeps the presentation component isolated from any implementation details, allowing us to reuse this component between the widget, wocket, and any other type of item we may add in the future.  It also allows us to use this component outside of this application.  Finally, it helps when we want to test this component in isolation, which I'd like to speak about next.
      </p>

      <h2>Component Test Application</h2>

      <p>
        <i>Note that the below code examples use React and Webpack, but the same ideas can be applied to other similar frameworks/libraries.</i>
      </p>

      <p>
      Often as web developers we're given a design to implement along with some instruction on how the component should behave given some interactions or scenarios.  It can become difficult to test all these use cases, and even more difficult to demonstrate their functionality to the designer or product owner.  Creating a test application which displays each component in the various states is an extremely useful tool to accomplish this goal.
      </p>

      <p>
      There are many ways to build this test application, but build tools like <a href="https://webpack.github.io/">Webpack</a> or <a href="http://browserify.org/">Browserify</a> make this process fairly easy.  These build tools take an entry point (usually an index.js file) and spiders out to find all the dependencies and inclusions from that file.  We can create a test application in the same application by using a separate entry point, and have this test entry point include the component test pages instead of the real application.  This allows us to keep the test pages side by side within the real application, but not include these test assets in our production build.
      </p>

      <h3>Creating the Test Application Components</h3>

      <p>
      The first thing to do is create the test application index file, along with any test application containers.  These files should follow the same pattern that you use in your production files, so if you have a separate process please follow that.  Really what you're trying to accomplish here is to create a new entry point for Webpack to use when building your test application.  Once you have the test application index file, you can create containers to test out your presentation components and include those within the test application index file.
      </p>

      <pre className="prettyprint">
{`// test-app-index.js

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

// import the TestApp and components to test

render(
  <Router history={browserHistory}>
    <Route path="/" component={TestApp}>
      <Route path="/widget" component={WidgetTestContainer} />
    </Route>
  </Router>,
  document.getElementById('app')
);
`}
      </pre>

      <pre className="prettyprint">
{`// widget-test.container.js

import React from 'react';

// import the widget component

export default function WidgetTestContainer() {
  return (
    <div>

      <Widget
        foo={bar}
        baz={false}
        // ...
      />

      <Widget
        foo={false}
        baz={true}
        // ...
      />

      // include additional tests as needed...

    </div>
  );
}
`}
      </pre>

      <h3>Add Test Application to Webpack Config</h3>

      <p>
      With those files in place, we can add the entry point to our <code>webpack.config.js</code> file:
      </p>

      <pre className="prettyprint">
{`// webpack.config.js

    // ...

    // if TEST_APP then we build the test application, else the main one
    if (process.env.TEST_APP) {
      entry.push(path.join(appPath, 'test-app-index.js'));
    } else {
      entry.push(path.join(appPath, 'index.js'));
    }

    // ...
`}
      </pre>

      <p>
      There are many ways to accomplish this, but the above example uses an environment variable <code>TEST_APP</code> to determine if the <code>test-app-index.js</code> or <code>index.js</code> file should be included in the build.  If we set <code>TEST_APP</code> to <code>true</code> the test application will be built, along with all of it's test containers and various uses of the presentation components.  If we instead do not set <code>TEST_APP</code> (as our normal build would do), the main application will be built, leaving out all the test containers and other test assets.
      </p>

      <h2>Conclusion</h2>

      <p>
      In keeping presentation components pure and not binding them to any specific implementation, we're able reuse them across the current application and in other external applications.  We're also able to easily test the presentation component's various states in a component test application, and not have to worry about mocking out API calls or state transitions.  Combining both of these techniques can be very helpful in building reusable, maintainable, web components.
      </p>

      <p>
      Many of the ideas above can be found within a web application that I've put together and made available on GitHub here: <a href="https://github.com/dylants/watchlist">https://github.com/dylants/watchlist</a>
      </p>
    </section>
  );
}
