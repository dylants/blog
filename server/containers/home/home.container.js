import React from 'react';
import { Link } from 'react-router';

import serverConfig from '../../config';
import {
  generatePostUrl,
  generateSample,
  generateSampleSlim,
  getPosts,
} from '../../lib/posts';

const POSTS = getPosts();

const MAX_POSTS_TO_DISPLAY_IMAGES = serverConfig.maxPostsToDisplayImages;
// generate sample for each post at startup
POSTS.forEach((post, count) => {
  const { config } = post;

  if (count < MAX_POSTS_TO_DISPLAY_IMAGES) {
    config.sample = generateSample(post.default, config.displayTimestamp);
  } else {
    config.sample = generateSampleSlim(post.default, config.displayTimestamp);
  }
});

export default function Home() {
  const posts = POSTS.map((post, count) => {
    const { config } = post;

    let imageToRender;
    if (count < MAX_POSTS_TO_DISPLAY_IMAGES) {
      imageToRender = (
        <div className="imageWrap">
          <img className="image" src={config.image} alt="" />
        </div>
      );
    }

    return (
      <Link to={generatePostUrl(config.timestamp, config.title)} key={config.timestamp}>
        <div className="post">
          {imageToRender}
          <div className="title">{config.title}</div>
          <div className="timestamp">{config.displayTimestamp}</div>
          <p className="sample">{config.sample}</p>
        </div>
      </Link>
    );
  });

  return (
    <main>
      {posts}
    </main>
  );
}
