var expect = require('chai').expect;
var winstonError = require('./index');

describe('Error rewriter', function() {
  var meta;

  describe('without original metadata', function() {
    beforeEach(function() {
      meta = winstonError()('info', new Error('test'));
    });

    it('should add meta.error', function() {
      expect(meta).to.have.deep.property('error.message', 'test');
      expect(meta).to.have.deep.property('error.stack');
    });
  });

  describe('with original metadata', function() {
    var originalMetadata;

    beforeEach(function() {
      originalMetadata = {foo: 'bar'};
      meta = winstonError()('info', new Error('test'), originalMetadata);
    });

    it('should keep original metadata information', function() {
      expect(meta).to.have.property('foo', 'bar');
    });

    it('should add meta.error', function () {
      expect(meta).to.have.deep.property('error.message', 'test');
      expect(meta).to.have.deep.property('error.stack');
    });

    it('should leave original metadata untouched', function() {
      expect(meta).to.not.equal(originalMetadata);
    });
  });
});