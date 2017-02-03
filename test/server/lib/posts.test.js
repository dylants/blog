import _ from 'lodash';
import moment from 'moment';
import should from 'should';

describe('The posts library', () => {
  let postsLib;

  beforeEach(() => {
    postsLib = require('../../../server/lib/posts');
  });

  it('should exist', () => {
    should.exist(postsLib);
  });

  describe('generatePostUrl', () => {
    it('should work with a simple title', () => {
      should(
        postsLib.generatePostUrl('20160529', 'Some Name of a Post'),
      ).equal('/posts/20160529/some-name-of-a-post');
    });

    it('should work with a title that has invalid characters', () => {
      should(
        postsLib.generatePostUrl('20160529', 'This (post) / is ? bad'),
      ).equal('/posts/20160529/this-post-is-bad');
    });
  });

  describe('generateDisplayTimestamp', () => {
    it('should work', () => {
      should(
        postsLib.generateDisplayTimestamp('20160529'),
      ).equal('May 29, 2016');
    });
  });

  describe('getPostFileNames', () => {
    let fileNames;

    beforeEach(() => {
      fileNames = postsLib.getPostFileNames();
    });

    it('should contain at least one entry', () => {
      should(fileNames.length).be.above(0);
    });

    it('should be sorted with newest first', () => {
      const firstMoment = moment(_.trimEnd(fileNames[0], '.js'), 'YYYYMMDD');
      const secondMoment = moment(_.trimEnd(fileNames[1], '.js'), 'YYYYMMDD');

      should(firstMoment.isAfter(secondMoment)).be.true();
    });
  });

  describe('getPosts', () => {
    let posts;

    beforeEach(() => {
      posts = postsLib.getPosts();
    });

    it('return a list of more than one', () => {
      should(posts.length).be.above(0);
    });

    it('elements in the list should have a config', () => {
      should(posts[0].config).ok();
    });
  });

  describe('truncateTextFromComponent', () => {
    let sample;

    beforeEach(() => {
      // yes, this might break one day.. but until then :)
      const component = postsLib.getPosts()[0];
      sample = postsLib.truncateTextFromComponent(
        component.default,
        component.config.displayTimestamp,
        200,
      );
    });

    it('should return truncated text', () => {
      should(sample.length).be.belowOrEqual(200);
    });

    it('should end with ellipsis', () => {
      should(sample).endWith('...');
    });
  });
});
