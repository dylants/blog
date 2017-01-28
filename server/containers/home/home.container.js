import React from 'react';
import { Link } from 'react-router';

import {
  getPosts,
  generatePostUrl,
} from '../../lib/posts';

const POSTS = getPosts();

export default function Home() {
  const posts = POSTS.map((post) => {
    const { config } = post;
    return (
      <Link to={generatePostUrl(config.timestamp, config.title)} key={config.timestamp}>
        <div className="post">
          <div className="imageWrap">
            <img className="image" src={config.image} alt="" />
          </div>
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
