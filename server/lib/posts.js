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
