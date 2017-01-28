import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import moment from 'moment';
import slugify from 'slugify';

export function generatePostUrl(timestamp, title) {
  return `/posts/${timestamp}/${slugify(title.toLowerCase())}`;
}

export function generateDisplayTimestamp(timestamp) {
  return moment(timestamp, 'YYYYMMDD').format('MMMM D, YYYY');
}

export function generateSample(text) {
  return _.truncate(text, {
    length: 400,
    separator: ' ',
  });
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
