import React from "react";

import { generateDisplayTimestamp } from "../lib/posts";

import PostTitle from "../components/post-title/post-title.component";

const TITLE = "Been a While...";
const TIMESTAMP = "20240101";
const DISPLAY_TIMESTAMP = generateDisplayTimestamp(TIMESTAMP);

export const config = {
  image: "https://dylants-blog.s3.amazonaws.com/public/images/20240101/beenawhile.jpg",
  title: TITLE,
  timestamp: TIMESTAMP,
  displayTimestamp: DISPLAY_TIMESTAMP,
};

export default function Post() {
  return (
    <section className="post">
      <PostTitle config={config} />

      <p>Well, hello there 👋 </p>

      <p>
        It's been a while since I last made a post. Many years in fact... It's funny, it's been so long that the original code that serves this blog was written using Node 6! Considering the fact that we're on Node 20 now, it's amazing that it still actually works!&nbsp;
      </p>

      <p>I'm still writing code and coming across interesting problems, so I thought I'd continue to document those solutions here. Mainly for my own history of learning what works, what I've tried, and how certain things behave. If someone else finds this helpful, that's a bonus!</p>

      <p>See ya in the code!</p>
    </section>
  );
}
