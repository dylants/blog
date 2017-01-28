import React from 'react';
import { Link } from 'react-router';

import {
  generatePostUrl,
  generateDisplayTimestamp,
  generateSample,
} from '../../lib/posts';

const POSTS = [
  {
    image: 'http://www.fillmurray.com/200/150',
    title: 'Components, Containers, and Test Apps',
    timestamp: '20160605',
    sample: generateSample('Web components aren’t exactly new, but their use is becoming more widely accepted. We’re no longer building pages with controllers and views that mix and match assets together, but rather seeing reusable components that separate pages share. Web developers are now being trained to draw boxes around parts of a page to build a sort of “Russian Doll” set of components. The idea of a component library for a suite of web applications is becoming easier to build, especially now that client side libraries and frameworks such as React and Angular 2 have positioned themselves to make components a first class citizen. '),
  },
  {
    image: 'http://www.fillmurray.com/300/300',
    title: 'Testing Node on the Server and Angular on the Client',
    timestamp: '20150128',
    sample: generateSample('One of the most useful features of Angular, in my opinion, is the focus on testing your code. Structuring your apps to use dependency injection by default, along with an out-of-the-box solution for unit and integration tests, gives anyone a great head start in testing their client code. Using a similar solution on the server side, and wiring it all together with a tool like Grunt, provides you with complete testing of your web application.'),
  },
  {
    image: 'http://www.fillmurray.com/150/100',
    title: 'Bundling Production Assets for MEAN.JS',
    timestamp: '20141119',
    sample: generateSample('Lately, I’ve been writing a lot of Angular on the client side and Node on the server side. More specifically, I’ve been using the MEAN.JS template in projects I create, which helps layout a structure to organize the code. Yes, there’s a lot of bloat that comes with some of these template projects (and especially with the generators), but once it’s all cleaned up and tailored to your project, I think it works very well.'),
  },
];

export default function Home() {
  const posts = POSTS.map(post => (
    <Link to={generatePostUrl(post.timestamp, post.title)}>
      <div className="post">
        <div className="imageWrap">
          <img className="image" src={post.image} alt="" />
        </div>
        <div className="title">{post.title}</div>
        <div className="timestamp">{generateDisplayTimestamp(post.timestamp)}</div>
        <p className="sample">{post.sample}</p>
      </div>
    </Link>
  ));

  return (
    <main>
      {posts}
    </main>
  );
}
