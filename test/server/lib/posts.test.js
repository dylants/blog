import should from 'should';
import lorem from 'lorem-ipsum';

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
        text = lorem({ count: 2, units: 'paragraphs' });
      });

      it('should return a truncated text', () => {
        should(postsLib.generateSample(text).length).be.belowOrEqual(400);
      });

      it('should end with ellipsis', () => {
        should(postsLib.generateSample(text).endsWith('...')).be.true();
      });
    });
  });
});
