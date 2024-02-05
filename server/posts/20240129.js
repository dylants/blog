import React from "react";

import { generateDisplayTimestamp } from "../lib/posts";

import PostTitle from "../components/post-title/post-title.component";

const TITLE = "Yarn Modern (2+) and GitHub Actions";
const TIMESTAMP = "20240129";
const DISPLAY_TIMESTAMP = generateDisplayTimestamp(TIMESTAMP);

export const config = {
  image: "https://dylants-blog.s3.amazonaws.com/public/images/20240129/yarn-modern-github-actions.png",
  title: TITLE,
  timestamp: TIMESTAMP,
  displayTimestamp: DISPLAY_TIMESTAMP,
};

export default function Post() {
  return (
    <section className="post">
      <PostTitle config={config} />

      <p>I've really enjoyed using GitHub Actions as a method to run CI for my projects. The integration with GitHub is fairly smooth, and once you get it setup, incorporating rules to prevent PR merges without green builds is pretty easy. This has all worked well up until I needed to upgrade Yarn (<a href="https://github.com/storybookjs/storybook/issues/22431#issuecomment-1630086092">for reasons to do with Storybook</a>). The process was <i>fairly</i> straightforward, but there were some issues getting GitHub Actions to play nice.</p>

      <h2>Upgrading Yarn</h2>

      <p>The first step is upgrading Yarn. There's <a href="https://yarnpkg.com/migration/guide">documentation on the Yarn site</a> on how to do this, but essentially it comes down to the following:</p>

      <ol>
        <li>Make sure you're using Node 18+</li>
        <li>Run <code>corepack enable</code> to activate Corepack</li>
        <li>Run <code>yarn set version stable</code> to use the latest version of Yarn</li>
        <li>Run <code>yarn install</code> to migrate the lockfile</li>
      </ol>

      <p>Since I was updating from a project that used <code>node_modules</code>, I felt it was simpler to continue to use that same format. So in a (newly created) <code>.yarnrc.yml</code> file I added the following:</p>

      <pre className="prettyprint lang-yaml">
{`# .yarnrc.yml

nodeLinker: node-modules`}
      </pre>

      <p>With this complete, my <code>package.json</code> file had a new entry to specify that my project used <code>"packageManager": "yarn@4.0.2"</code> (this is most likely a newer version in your project).</p>

      <h2>Updating GitHub Actions</h2>

      <p>With the Yarn upgrade complete, it's time to turn our attention to GitHub Actions. At a high level, the important changes we need to make are:</p>

      <ul>
        <li>Use Node.js 18+</li>
        <li>Enable Corepack <i>before</i> you setup Node</li>
      </ul>

      <p>Here's a sample GitHub Actions yml file to demonstrate:</p>

      <pre className="prettyprint lang-yaml">
{`# ci.js.yml

name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      - name: Enable Corepack
        run: corepack enable
      - name: Use Node.js 20.x
        uses: actions/setup-node@v4
        with:
          node-version: "20.x"
          cache: 'yarn'
      - name: Install dependencies
        run: yarn install --immutable
      - name: Run lint
        run: yarn lint
      - name: Run tests
        run: yarn test
      - name: Run build
        run: yarn build
`}
     </pre>

      <p>More details on the actions I took can be found in this PR: <a href="https://github.com/dylants/bookstore/pull/26/files">https://github.com/dylants/bookstore/pull/26/files</a></p>

    </section>
  );
}
