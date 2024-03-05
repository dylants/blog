import React from "react";

import { generateDisplayTimestamp } from "../lib/posts";

import PostTitle from "../components/post-title/post-title.component";

const TITLE = "Playwright Tests using GitHub Actions + Vercel";
const TIMESTAMP = "20240305";
const DISPLAY_TIMESTAMP = generateDisplayTimestamp(TIMESTAMP);

export const config = {
  image:
    "https://dylants-blog.s3.amazonaws.com/public/images/20240305/playwright-vercel.png",
  title: TITLE,
  timestamp: TIMESTAMP,
  displayTimestamp: DISPLAY_TIMESTAMP,
};

export default function Post() {
  return (
    <section className="post">
      <PostTitle config={config} />

      <p>For a recent project, I wrote some <a href="https://playwright.dev/">Playwright</a> end to end (e2e) tests which require a running web app connected to a database that contains seed data. This works fine locally, but I wanted to include it as part of the GitHub pull request checks. This meant we would need the app running somewhere externally with an accessible database. Once that exists, we need a GitHub Action to run the e2e tests against that application.</p>

      <h2>Vercel: Free App Hosting and Database</h2>

      <p><a href="https://vercel.com/">Vercel</a> offers a free "Hobby" plan which gives you automatic deployments via GitHub along with a database. My app happened to be built using Next.js, so the integration was smooth, but they support other frameworks as well. The network and storage limits are not great, but should be adequate for a starter project, and you can move to higher levels if needed.</p>

      <p>If you don't already have an account, create one and then sync your GitHub project. Once you do so, Vercel will generate deployments automatically, both preview and production, creating those deployment environments within your GitHub project (<a href="https://vercel.com/docs/deployments/git">more info on that here</a>). In my case, this instant deployment was a bit too quick, as I had to reconfigure some things on both the Vercel side and in the source code of the app to get it to work properly.</p>

      <h4>Prisma / Vercel Integration Issues</h4>

      <p>The default <code>build</code> command for my Next.js project generates a build, but Vercel caches that which can lead to issues with your Prisma client. There is a <a href="https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/vercel-caching-issue">help article from Prisma</a> which explains the solution. Essentially you need to add <code>prisma generate</code> to the Vercel build command prior to running the (app) build.</p>

      <h4>Create Database</h4>

      <p>Within Vercel, navigate to the Storage tab to create a new database. I chose a Postgres Database, and connected the database to my newly connected project. Within the advanced options of the connection panel, I set the "Environment Variables Prefix" to "DATABASE" as it then populated the <code>DATABASE_URL</code> environment variable with the value needed by my Prisma configuration. I also only chose to use this database instance with "Preview" deployments, not using the same database for "Production" deployments.</p>

      <div className="center">
        <img src="https://dylants-blog.s3.amazonaws.com/public/images/20240305/database-connect-project.png" alt="Database connection properties"/>
      </div>

      <h4>Database Migrations and Seeds</h4>

      <p>To run migrations and seed the database, a script was added to the project's <code>package.json</code> called <code>ci:db</code>. This script resets the database prior to migration, so we have a clean database on each deploy. <a href="/posts/20240212/seeding-prisma-databases-in-next-js">A previous post was written about seeding databases</a>. Using <code>bun</code> to run this script <i>after</i> the <code>next build</code> produced the complete build command for the Vercel project:</p>

      <pre className="prettyprint lang-bash">
{`prisma generate && next build && bun run ci:db`}
      </pre>

      <p>With all this configuration in place, the next Vercel deployment had a functioning app connected to a clean database with seed data.</p>

      <h2>GitHub Action: Run e2e Tests</h2>

      <p>Playwright <a href="https://playwright.dev/docs/ci-intro">has documentation on how to run tests as GitHub actions</a>, but we need to point Playwright to our Vercel deployment. To do so, I chose to use the <a href="https://github.com/patrickedqvist/wait-for-vercel-preview">wait-for-vercel-preview</a> GitHub action. This action will wait for the Vercel deploy to complete, and provide as output the URL to the running application. An example workflow is then:</p>

      <pre className="prettyprint lang-yml">
{`name: E2E Tests
on:
  pull_request:
    branches: [main]

jobs:
  e2e_setup:
    name: e2e test setup
    runs-on: ubuntu-latest
    outputs:
      preview_url: $\{\{ steps.waitFor200FromVercelPreview.outputs.url }}
    steps:
      - name: Waiting for 200 from the Vercel Preview
        uses: patrickedqvist/wait-for-vercel-preview@v1.3.1
        id: waitFor200FromVercelPreview
        with:
          token: $\{\{ secrets.GITHUB_TOKEN }}
          max_timeout: 300
  e2e_tests:
    needs: e2e_setup
    name: e2e tests
    timeout-minutes: 5
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repo
        uses: actions/checkout@v4
      - name: Install bun
        uses: oven-sh/setup-bun@v1
      - name: Use Node.js 20.x
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
      - name: Install dependencies
        run: bun install --frozen-lockfile
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      - name: Run e2e tests
        run: bun run test:e2e
        env:
          PLAYWRIGHT_BASE_URL: $\{\{ needs.e2e_setup.outputs.preview_url }}
`}
      </pre>

      <p>This will set the environment variable <code>PLAYWRIGHT_BASE_URL</code> to the Vercel URL. Update the <code>playwright.config.ts</code> file with an override for that environment variable:</p>

      <pre className="prettyprint lang-js">
{`  ...
  use: {
    ...

    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',

    ...
  },
  ...
`}
      </pre>

      <h4>Vercel Authentication</h4>

      <p>The <code>wait-for-vercel-preview</code> GitHub action currently doesn't support the Vercel authentication requirements (see <a href="https://github.com/patrickedqvist/wait-for-vercel-preview/issues/62">https://github.com/patrickedqvist/wait-for-vercel-preview/issues/62</a>). As a workaround, disable the authentication requirements:</p>

      <ul>
        <li>Navigate to: Vercel -&gt; &lt;project&gt; -&gt; Settings</li>
        <li>Click on the "Deployment Protection" tab</li>
        <li>Disable "Vercel Authentication"</li>
      </ul>

      <h2>Summary</h2>

      <p>New pull requests will automatically deploy the app to Vercel, reset, migrate, and seed the database, and run the e2e tests. PRs will take a bit longer to run, something you will need to take into account, but the result is only merging code that does not break e2e tests.</p>

    </section>
  );
}
