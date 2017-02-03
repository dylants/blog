import React from 'react';

import {
  generateDisplayTimestamp,
} from '../lib/posts';

import PostTitle from '../components/post-title/post-title.component';

const TITLE = 'Multivariate (A/B) Testing';
const TIMESTAMP = '20131209';
const DISPLAY_TIMESTAMP = generateDisplayTimestamp(TIMESTAMP);

export const config = {
  image: 'https://s3.amazonaws.com/dylants-blog/public/images/20131209/a-b-testing.jpg',
  title: TITLE,
  timestamp: TIMESTAMP,
  displayTimestamp: DISPLAY_TIMESTAMP,
};

export default function Post() {
  return (
    <section className="post">
      <PostTitle title={TITLE} timestamp={DISPLAY_TIMESTAMP} />

      <p>
      In web application development, testing the source code to verify it correctly produces the features required is a common practice. Developers will often write tests to validate that the code written satisfies the requirement originally set during the initial design of the feature. This same mindset should exist not just during development, but early in the design of the web application itself, to verify the product is something people actually want. And it doesn't have to stop there &mdash; after the product is launched, testing can continue to gather information on how users interact with the application, what works, what doesn't, and what should be redesigned.
      </p>

      <p>
      The process of testing the design of the product is known as <a href="https://en.wikipedia.org/wiki/Multivariate_testing">multivariate testing</a>. Multivariate testing (sometimes referred to as A/B testing, or split testing), gives the product designers a way of testing certain ideas on the users while providing analytics on those actions. Those results help determine if any changes are necessary to improve the product and increase <a href="https://en.wikipedia.org/wiki/Conversion_rate">conversion rates</a>. Changes can be anything, from a simple change of color, to a complete layout redesign.
      </p>

      <p>
      When a user visits a site under multivariate testing, the user is put into either a control or test group. Within the control group, the user will see the normal content originally designed. Users in the test group, however, will see a new design intended to test out a new look or feel. Users proceed as normal from there but actions they take are collected and analyzed to understand which design performed better: the control or the test.
      </p>

      <p>
      Before we take a look at how to setup a page for multivariate testing, let's first discuss how to take advantage of Google Analytics to provide both page and user interaction tracking.
      </p>

      <h2>Google Analytics: Universal Analytics</h2>

      <p>
      There are many ways to perform analytics on a web application, but Google Analytics certainly is at the top of the list. Google is (at the time of this writing) currently rolling out a change to the way they handle analytics with the introduction of <a href="https://developers.google.com/analytics/devguides/collection/analyticsjs/">Universal Analytics</a>. Custom dimensions and metrics have replaced custom variables while new features (such as support for platforms other than websites) are available on the universal platform. For more information on Universal Analytics, <a href="https://support.google.com/analytics/answer/2790010?hl=en">please see this overview</a>.
      </p>

      <p>
      To begin using Google Analytics, you must create an account within the platform. The account is not your Google account, but instead an account to reference the analytics that will be tracked. This can be either a website or mobile application, and Google recommends the use of Universal Analytics rather than the Classic Analytics tracking method. Within the creation of a new account, a property is necessary. For websites, a property would be the website that will be tracked. A name and URL is required, along with some additional information. (Note that for local testing on localhost, the URL must still end in .com/.org/etc. Specifying http://localhost.com for the default URL will suffice).
      </p>

      <p>
      With the account and property setup, a Tracking ID will be provided which can be used within the analytics JavaScript code to reference your account. From here you can add custom domains and metrics which help manage custom attributes tracked on your application. Google Analytics also includes events which can be tracked in real-time giving you an immediate indication of what actions your users are taking. Other data such as page views can also be tracked real-time. Custom reports can be created to give a personalized look at the collected data. More information can be found on the <a href="https://developers.google.com/analytics/devguides/collection/analyticsjs/">Universal Analytics developers guide site</a>.
      </p>

      <p>
      With analytics in place, we can turn our attention to multivariate testing.
      </p>

      <h2>The Multivariate Library</h2>

      <p>
      When I first set out to build a multivariate test, I looked through the open source community to find one that was JavaScript based (for client side usage) and supported the new Universal Analytics version of Google Analytics. And at that time, one didn't seem to exist that met those requirements. I began to build a solution around it myself and found it could be generalized and potentially used by others. <a href="https://github.com/dylants/multivariate">The multivariate project can be found on GitHub</a>, and includes documentation, <a href="https://github.com/dylants/multivariate/tree/master/demo">a demo site</a>, along with <a href="https://github.com/dylants/multivariate/tree/master/demo#install-dependencies">instructions on how to install via Bower</a>.
      </p>

      <a href="https://github.com/dylants/multivariate">Multivariate</a> was written to help you define a test, specify the sample size of your audience which should see the test, and collect data to verify if the test was successful. Support for Google (Universal) Analytics is built into multivariate to allow you to track page views, custom metrics or dimensions, and user interaction through events.

      <h3>Quick Start with Multivariate</h3>

      <p>
      A/B web tests are intended to display one page to the control group and a separate, though similar, page to the test group. To begin using multivariate to create an A/B test, first decide which element(s) you wish to toggle between the control and test groups. Then assign the <code>mv-control</code> or <code>mv-test</code> class to these elements. For example:
      </p>

      <pre className="prettyprint">
{`<!-- This will be displayed to the control group -->
<button class="mv-control">Submit</button>

<!-- This will be displayed to the test group -->
<button class="mv-test">Press Here To Complete</button>
`}
      </pre>

      <p>
      When users in the control group are shown the page, they will see the elements with the <code>mv-control</code> class displayed (and not test elements). Similarly, when users in the test group view the page, they will see elements with the <code>mv-test</code> class displayed (and not control elements).
      </p>

      <p>
      To configure multivariate so this behavior takes place, include the multivariate library on your page, and configure multivariate:
      </p>

      <pre className="prettyprint">
{`// create a new multivariate test
var mv = new Multivariate("submit-button-test");

// execute the A/B test
mv.runTest();
`}
      </pre>

      <p>
      Instantiate a new multivariate object for each test you wish to run. Each test requires a unique name which is used when remembering which user is in which test. Once instantiated, execute <code>runTest()</code> to run the A/B test on the user. Calling this function will toggle either the control or test content based on which cohort the user falls within.
      </p>

      <h3>Further Information</h3>

      <p>
      To learn more about multivariate, please refer to the <a href="https://github.com/dylants/multivariate">multivariate GitHub page</a>. The project includes documentation on the product, <a href="https://github.com/dylants/multivariate/tree/master/demo">a demo site</a>, and an API overview. Pull requests are welcome!
      </p>

    </section>
  );
}
