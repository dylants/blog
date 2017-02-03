import ReactDOMServer from 'react-dom/server';
import _ from 'lodash';
import cheerio from 'cheerio';
import fs from 'fs';
import moment from 'moment';
import path from 'path';
import slugify from 'slugify';

import config from '../config';

export function generatePostUrl(timestamp, title) {
  return `/posts/${timestamp}/${slugify(title.toLowerCase())}`;
}

export function generateDisplayTimestamp(timestamp) {
  return moment(timestamp, 'YYYYMMDD').format('MMMM D, YYYY');
}

export function getPostFileNames() {
  const files = fs.readdirSync(path.join(__dirname, '../posts'));
  return _.chain(files)
    // only get the posts
    .filter(f => _.endsWith(f, '.js'))
    // sort by newest first
    .sortBy().reverse()
    .value();
}

export function getPosts() {
  const fileNames = getPostFileNames();
  return fileNames.map(fileName => (
    require(path.join(__dirname, '../posts', fileName))
  ));
}

export function truncateTextFromComponent(component, marker, length) {
  // generate the text from the component
  const html = ReactDOMServer.renderToStaticMarkup(component());
  const text = cheerio.load(html).text();

  // remove the beginning up to the marker
  const index = text.indexOf(marker);
  const parsedText = text.slice(index + marker.length);

  return _.truncate(parsedText, {
    length,
    separator: ' ',
  });
}

export function generateSample(component, marker) {
  return truncateTextFromComponent(component, marker, config.sampleLength);
}

export function generateSampleSlim(component, marker) {
  return truncateTextFromComponent(component, marker, config.sampleSlimLength);
}
