import _ from 'lodash';
import lorem from 'lorem-ipsum';
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
    it('should work', () => {
      should(
        postsLib.generatePostUrl('20160529', 'Some Name of a Post'),
      ).equal('/posts/20160529/some-name-of-a-post');
    });
  });

  describe('generateDisplayTimestamp', () => {
    it('should work', () => {
      should(
        postsLib.generateDisplayTimestamp('20160529'),
      ).equal('May 29, 2016');
    });
  });

  describe('generateSample', () => {
    describe('with short text', () => {
      let text;

      beforeEach(() => {
        text = 'hey';
      });

      it('should return the same text', () => {
        should(postsLib.generateSample(text)).equal('hey');
      });
    });

    describe('with long text', () => {
      let text;

      beforeEach(() => {
        text = lorem({ count: 5, units: 'paragraphs' });
      });

      it('should return a truncated text', () => {
        should(postsLib.generateSample(text).length).be.belowOrEqual(400);
      });

      it('should end with ellipsis', () => {
        should(postsLib.generateSample(text).endsWith('...')).be.true();
      });
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
});
