import React from 'react';

import {
  generateDisplayTimestamp,
} from '../lib/posts';

import PostTitle from '../components/post-title/post-title.component';

const TITLE = 'Universal / Isomorphic Web App';
const TIMESTAMP = '20170415';
const DISPLAY_TIMESTAMP = generateDisplayTimestamp(TIMESTAMP);

export const config = {
  image: 'https://s3.amazonaws.com/dylants-blog/public/images/20170415/isomorphic.png',
  title: TITLE,
  timestamp: TIMESTAMP,
  displayTimestamp: DISPLAY_TIMESTAMP,
};

export default function Post() {
  return (
    <section className="post">
      <PostTitle config={config} />

      <p>
        I've been working in the world of client side applications for a while now and have really enjoyed using <a href="https://facebook.github.io/react/">React</a> and <a href="http://redux.js.org/">Redux</a>. Together their simplicity has allowed me to code in a very deterministic fashion, knowing that if my unit tests pass the page will render. Though working solely in the client has some limitations, and since we own the server it feels a waste to not take advantage of it when rendering pages. The most apparent example comes about when any page needs to load data prior to rendering. When the HTTP request hits the server we <i>could</i> load that data. But instead we send back a small HTML skeleton and the JavaScript makes a subsequent request to load the data. It would be great if we could have knowledge of the UI's responsibilities during that initial request to the server.
      </p>

      <p>
        When putting together this blog I wanted to do some things programmatically, and ended up choosing React components for the blog posts themselves. These are rendered on the server and plain HTML is sent to the browser. There wasn't really a need to build in client side support, since the pages have no interaction. Implementing this gave me an early insight into the world of universal web applications. Even though it wasn't full universal, I was able to understand both server side and client side rendering individually. My next goal was to combine them in a single application.
      </p>

      <p>
        One of the most difficult pieces of building a universal application is getting all the various technology pieces to "play nice" with each other. Most of the starter kits I had researched were either too big, or didn't combine the technologies I wanted to use. So taking bits and pieces, I assembled an application which hopefully illustrates a simple example of a universal (client and server rendering) web application. The application has the following main technologies:
      </p>

      <ul>
        <li>React</li>
        <li>React Router 4</li>
        <li>Redux</li>
        <li>CSS Modules (using Sass)</li>
        <li>Express</li>
        <li>Webpack 2</li>
        <li>Babel</li>
        <li>ESLint</li>
      </ul>

      <p>
        The web application source code can be found here: <a href="https://github.com/dylants/universal">https://github.com/dylants/universal</a>. The remainder of this post reviews some of the high level concepts explored within this application.
      </p>

      <h2>Route Configuration</h2>

      <p>
        Within this application, we have both client side routes and server side routes. I have chosen to name them after the technologies which use them, so React routes and Express routes. Let's focus first on the client side routes, or React routes.
      </p>

      <h3>React Routes</h3>

      <p>
        <a href="https://github.com/ReactTraining/react-router">React Router</a> is used to drive the routing on the client side. Its route definition is quite simple &mdash; an array of objects. Below is the configuration for our routes within the application:
      </p>

      <pre className="prettyprint">
{`import App from '../containers/app/app.container';
import Home from '../containers/home/home.container';
import Page1 from '../containers/page1/page1.container';
import Page2 from '../containers/page2/page2.container';

export const routes = [
  {
    component: App,
    routes: [
      {
        path: '/',
        exact: true,
        component: Home,
      },
      {
        path: '/page1',
        exact: true,
        component: Page1,
      },
      {
        path: '/page2',
        exact: true,
        component: Page2,
      },
    ],
  },
];
`}
      </pre>

      <p>
        This states that we have 3 routes within our application: <code>Home</code>, <code>Page1</code>, and <code>Page2</code>. A wrapping component (<code>App</code>) contains all the subcomponents. In addition we've taken advantage of the <code>exact</code> flag to denote that these routes will only trigger when an exact URL match occurs. This is important since our root route (<code>/</code>) would trigger for all routes without this flag.
      </p>

      <h3>Express Routes</h3>

      <p>
        In addition to the React routes we've defined above, our application supplies some APIs which help populate data needed by those views. There's also the server side route which provides us a hook to render the client side view. Using <a href="https://expressjs.com/en/guide/routing.html">Express routing</a> we've constructed the following routes file:
      </p>

      <pre className="prettyprint">
{`import { loadPage1Data } from '../controllers/page-data.controller';
import render from '../controllers/render.controller';

module.exports = (router) => {
  router.route('/api/page/1').get(loadPage1Data);

  // if at this point we don't have a route match for /api, return 404
  router.route('/api/*').all((req, res) =>
    res.status(404).send({
      error: \`route not found: $\{req.url}\`,
    }),
  );

  // all other routes are handled by our render (html) controller
  router.route('*').all(render);
};
`}
      </pre>

      <p>
        Here we've created an API for a <code>GET</code> request of page 1's data, which is handled by the imported controller function. There are also two catch-all routes. The first is positioned after all the API routes have been defined, and responds with a <code>404</code> when a request is made to some undefined API. The second is a global match which is placed after everything else, and handles rendering on the server. This allows us to fall back to the React routes for routes not defined here.
      </p>

      <h2>Rendering on the Server</h2>

      <p>
        React Router comes with a set of tools to help you in constructing your routes, two of which are <code>matchRoutes</code> and <code>renderRoutes</code> found in <a href="https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config"><code>react-router-config</code></a>. The server takes advantage of both of these functions when rendering HTML.
      </p>

      <h3>Match Routes</h3>

      <p>
        The render controller is running on the server, and unlike the client, does not have access to the React component lifecycle. Therefore we have to establish a pattern for loading initial data for the components to use. We do this in part through the <code>matchRoutes</code> function. This helps us find which component(s) will be rendered, and then from those, load the data. Once the data has been loaded we can render the views as we would normally.
      </p>

      <pre className="prettyprint">
{`import _ from 'lodash';
import createMemoryHistory from 'history/createMemoryHistory';
import { matchRoutes } from 'react-router-config';

import configureStore from '../config/store';
import { routes } from '../routes/react-routes';

export default function render(req, res, next) {
  // create a new history and redux store on each (server side) request
  const history = createMemoryHistory(req.url);
  const store = configureStore(undefined, history);

  // determine the list of routes that match the incoming URL
  const matches = matchRoutes(routes, req.url);

  // build up the list of functions we should run prior to rendering
  const promises = matches.map(({ route }) => {
    // for each, return the fetchData Promise or a resolved Promise
    const fetchData = _.get(route, 'component.WrappedComponent.fetchData');
    return fetchData ? fetchData({ store }) : Promise.resolve();
  });

  ...
}
`}
      </pre>

      <p>
        The above code sets up a new Redux store on each request (so each server side request is a blank slate &mdash; keep in mind this is fine, since the client should take over for future requests and retain the Redux state). It then finds the list of components which match the incoming URL. From those components, it grabs the <code>fetchData</code> function which it runs sending it the Redux store. If the <code>fetchData</code> function does not exist, a resolved Promise is used. The list of all these Promises is stored in our <code>promises</code> variable.
      </p>

      <p>
        So some of the components will have defined the static <code>fetchData</code> function, while others will not, and instead we'll use the resolved Promise. In our example application, we have the <code>Page1</code> component which defines it's <code>fetchData</code> function as below:
      </p>

      <pre className="prettyprint">
{`import React, { Component } from 'react';

import { loadPage1Data } from '../../actions/page.actions';

class Page1 extends Component {
  static fetchData({ store }) {
    return store.dispatch(loadPage1Data());
  }


  ...
}
`}
      </pre>

      <p>
        With the passed in <code>store</code> we're able to get access to the Redux <code>dispatch</code> which allows us to fire off an action. In this case, it's the <code>loadPage1Data</code> action.
      </p>

      <h3>Render Routes</h3>

      <p>
        After the render controller has matched the routes and loaded the data (or at least, collected a set of Promises), it can then proceed to render the React routes:
      </p>

      <pre className="prettyprint">
{`import React from 'react';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router';
import { renderRoutes } from 'react-router-config';
import { renderToString } from 'react-dom/server';

import { routes } from '../routes/react-routes';

export default function render(req, res, next) {
  ...

  // build up the list of functions we should run prior to rendering
  const promises = ...

  // load all the data necessary to render the route
  return Promise.all(promises)
    .then(() => {
      // get the HTML content for our server side rendering
      const htmlContent = renderToString(
        <Provider store={store}>
          <StaticRouter history={history} location={req.url} context={{}}>
            {renderRoutes(routes)}
          </StaticRouter>
        </Provider>,
      );

      // get the state from the store to send it to the client
      // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
      const reduxState = JSON.stringify(store.getState()).replace(/</g, '\\u003c');

      // return the rendered index page with included HTML content and redux state
      return res.render('index', {
        reduxState,
        htmlContent,
      });
    })
    .catch(err => next(err));
}
`}
      </pre>

      <p>
        The above code waits for all the promises to complete and then proceeds to render the HTML content. It does this using a Redux <code>Provider</code> and a React Router <code>StaticRouter</code>, along with the <code>renderRoutes</code> call on the React routes. This HTML content can then be returned to the user as server side rendered React components. However, the client side will take over in our universal application, and it needs to be aware of the data we've loaded and stored in our Redux store. So in addition to the HTML content, we also send the Redux store in the response for the client to parse on startup.
      </p>

      <h2>Rendering on the Client</h2>

      <p>
        When the client initializes, it can take the Redux store that was populated by the server as its initial state. Then when the React component lifecycle takes place, the Redux action which would normally load the data now sees that the data already exists. Instead of performing a separate HTTP call, the client can simply do nothing. When React renders the components in its virtual DOM, it can verify that the rendered HTML matches. This allows it to skip a replacement and leave the rendered HTML.
      </p>

      <p>
        Below is the client configuration file:
      </p>

      <pre className="prettyprint">
{`/* global window, document */

import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config';

import configureStore from './store';
import { routes } from '../routes/react-routes';

const initialState = window.__REDUX_STATE__;
delete window.__REDUX_STATE__;

const history = createBrowserHistory();
const store = configureStore(initialState, history);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      {renderRoutes(routes)}
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app'),
);
`}
      </pre>

      <p>
        The code above grabs the Redux store off the <code>window</code> and then uses it as the initial state. The <code>renderRoutes</code> along with the React routes are both once again used to render the React components for the given URL. Here we're using React Router's <code>ConnectedRouter</code> to link into Redux.
      </p>

      <h2>Best of Both Worlds</h2>

      <p>
        Using the pattern established above, the server receives the initial request from the browser and is able to load any initial data necessary and send rendered HTML to the user. This saves the client from having to send another request right back to the server while displaying a "loading" page to the user. (This pattern can also be tweaked so that certain actions which take longer occur only after the user is shown HTML, again with the "loading" animation.) Overall, it avoids the multiple requests which hinder client side only applications by rendering on the server, but still providing the quick interactions of client side rendering after the initial response.
      </p>

    </section>
  );
}
