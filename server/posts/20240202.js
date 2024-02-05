import React from "react";

import { generateDisplayTimestamp } from "../lib/posts";

import PostTitle from "../components/post-title/post-title.component";

const TITLE = "Testing APIs in Next.js";
const TIMESTAMP = "20240202";
const DISPLAY_TIMESTAMP = generateDisplayTimestamp(TIMESTAMP);

export const config = {
  image: "https://dylants-blog.s3.amazonaws.com/public/images/20240202/nextjs-api-testing.png",
  title: TITLE,
  timestamp: TIMESTAMP,
  displayTimestamp: DISPLAY_TIMESTAMP,
};

export default function Post() {
  return (
    <section className="post">
      <PostTitle config={config} />

      <p>The latest version of Next.js (which uses the App Router) allows developers to define APIs using <a href="https://nextjs.org/docs/app/building-your-application/routing/route-handlers">Route Handlers</a>. APIs are then defined by the location of the <code>route.js</code> file (which defines the URL) and the exported function (which defines the HTTP method: GET, POST, etc). Documentation exists for creating the routes, but how to test those routes is left to the user.</p>

      <p>In previous Next.js iterations, I had used <a href=""><code>node-mocks-http</code></a>. But the App Router updates makes that solution no longer an option. Instead I utilized a mixture of directly creating <a href="https://developer.mozilla.org/en-US/docs/Web/API/Request"><code>Request</code></a> objects and mocking any downstream dependencies with Jest.</p>

      <h2>Creating a Request</h2>

      <p>In the test, to create the request I wrapped <code>Request</code> with <a href="https://nextjs.org/docs/app/api-reference/functions/next-request"><code>NextRequest</code></a>. For example, to send a request to test <code>/api/widgets</code>:</p>

      <pre className="prettyprint">
{`const req = new NextRequest(new Request('http://domain/api/widgets'), {
  method: 'GET',
});
const res = await GET(req);
`}
      </pre>

      <p><i>Note that the HTTP protocol and the domain do not matter here, but need to be supplied to fullfil the requirement of the request/response processing. So simply putting <code>http://domain</code> will suffice.</i></p>

      <p>Running this test will send an empty GET request to <code>/api/widgets</code> and set the response in <code>res</code>. You could then verify the response data with something like:</p>

      <pre className="prettyprint">
{`expect(res.status).toEqual(200);
`}
      </pre>

      <h2>Mocking the Downstream Dependencies</h2>

      <p>If your API makes database calls, you may want to mock those calls or provide stubs, or a combination. In this example we'll use Jest to mock the <a href="https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations">Next.js Server Action</a> function which loads the widgets, named <code>getWidgets</code>.</p>
      
      <p>Imagine this is the API code:</p>

      <pre className="prettyprint">
{`export async function GET(request: NextRequest) {
  const response = await getWidgets();

  return Response.json(response);
}
`}
      </pre>

      <p>In your test, you could mock <code>getWidgets</code> like so:</p>

      <pre className="prettyprint">
{`const mockGetWidgets = jest.fn();
jest.mock('<path_to_actions>/actions/widgets', () => ({
  getWidgets: (...args: unknown[]) => mockGetWidgets(...args),
}));
`}
      </pre>

      <p>Then in the test, let's have the widgets return a list of strings: ["hello", "you"]. Our full test would then be:</p>

      <pre className="prettyprint">
{`mockGetWidgets.mockReturnValue(['hello', 'you']);

const req = new NextRequest(new Request('http://domain/api/widgets'), {
  method: 'GET',
});
const res = await GET(req);

expect(mockGetWidgets).toHaveBeenCalled();
expect(res.status).toEqual(200);
expect(await res.json()).toEqual(['hello', 'you']);
`}
      </pre>

    </section>
  );
}
