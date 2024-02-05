import React from "react";

import { generateDisplayTimestamp } from "../lib/posts";

import PostTitle from "../components/post-title/post-title.component";

const TITLE = "Using shadcn/ui for components";
const TIMESTAMP = "20240119";
const DISPLAY_TIMESTAMP = generateDisplayTimestamp(TIMESTAMP);

export const config = {
  image: "https://dylants-blog.s3.amazonaws.com/public/images/20240119/shadcn-ui.png",
  title: TITLE,
  timestamp: TIMESTAMP,
  displayTimestamp: DISPLAY_TIMESTAMP,
};

export default function Post() {
  return (
    <section className="post">
      <PostTitle config={config} />

      <p>Building apps without a Designer can lead to some pretty poor looking screens (<em>read: Designers are hugely important!</em>). But when working solo, I've often wanted a set of core components that I could use while building out the application logic. I was introduced to <a href="https://ui.shadcn.com/">shadcn/ui</a>, and find it quite valuable.</p>

      <h2>Not a Component Library</h2>

      <p>So technically shadcn/ui is not a component library. But it kinda is. The trick is you "install" the components via a script that adds code to your application. You can then tweak the code as you see fit. But this means that any changes to the original component (in shadcn/ui's source control) won't be reflected in the version that you've already installed.</p>

      <p>Really this means that these are component starter kits, that are fairly generic design-wise. It's up to you to add color/behavior/style as you see fit. In previous companies we've used them as just that &mdash; starters that the Designers style a bit, and we use <em>that</em> as the component library.</p>


      <h2>Initial Setup</h2>

      <p>There's some initial setup that needs to take place before using shadcn/ui. The <a href="https://ui.shadcn.com/docs/installation">online documentation</a> does a great job of explaining the process, but essentially it comes down to running this command:</p>

      <pre className="prettyprint lang-bsh">{`npx shadcn-ui@latest init`}</pre>

      Some considerations:
      <ul>
        <li>You should be using <a href="https://tailwindcss.com/">Tailwind</a> if you aren't already</li>
        <li>I prefer to <em>not</em> use CSS variables since this makes integration with Tailwind simpler (IMO)</li>
      </ul>

      <p>You might have to tweak some things after the command has run to make sure all the files and directories are pointing to the correct location. I also renamed <code>lib/utils</code> to <code>lib/tailwind-utils</code> to be more specific.</p>

      <h2>Installing a Component</h2>

      <p>Installing components is the fun part! Just browse the <a href="https://ui.shadcn.com/docs/components">full list of components available</a> and choose one to install. For example, most people would probably want to import the <a href="https://ui.shadcn.com/docs/components/button"><code>Button</code></a> component:</p>

      <pre className="prettyprint lang-bsh">{`npx shadcn-ui@latest add button`}</pre>

      <p>Now browse to <code>components/ui/button.tsx</code> to see the newly created component and tweak to your liking! (<i>One other note: <a href="https://storybook.js.org/">Storybook</a> can be very helpful in demo'ing these components if you aren't already using it.</i>)</p>

    </section>
  );
}
