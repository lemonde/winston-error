var expect = require('chai').expect;
var winston = require('winston');
var winstonError = require('./index');

// Add memory output.
winston.add(winston.transports.Memory);

describe('Error helper', function() {
  var logger;

  context('with default parameters', function () {
    beforeEach(function () {
      logger = new winston.Logger({
        transports: [
          new winston.transports.Memory({json: true})
        ]
      });

      winstonError(logger);
    });

    it('should log error properly by copying default fields in metadata', function() {
      var err = new Error('test');
      err.bar = 'baz';

      logger.error(err);
      var logEntry = JSON.parse(logger.transports.memory.errorOutput[0]);
      expect(logEntry).to.have.deep.property('error.message', 'test');
      expect(logEntry).to.have.deep.property('error.stack');
      expect(logEntry).to.have.deep.property('error.code');
      expect(logEntry).to.have.property('message', 'test');
    });

    it('should keep existing metada', function() {
      var err = new Error('test');
      err.bar = 'baz';

      logger.error(err, {foo: 'bar'});
      var logEntry = JSON.parse(logger.transports.memory.errorOutput[0]);
      expect(logEntry).to.have.deep.property('error.message', 'test');
      expect(logEntry).to.have.deep.property('error.stack');
      expect(logEntry).to.have.deep.property('error.code');
      expect(logEntry).to.have.property('foo', 'bar');
      expect(logEntry).to.have.property('message', 'test');
    });
  });

  context('with explicit fields to pick', function () {
    beforeEach(function () {
      logger = new winston.Logger({
        transports: [
          new winston.transports.Memory({json: true})
        ]
      });

      winstonError(logger, {
        pickedFields: [
          'message',
          'stack',
          'bar'
        ]
      });
    });

    it('should log error properly by copying only specified fields in metadata', function() {
      var err = new Error('test');
      err.bar = 'baz';

      logger.error(err);
      logger.error(new Error('test'));

      var logEntry = JSON.parse(logger.transports.memory.errorOutput[0]);
      expect(logEntry).to.have.deep.property('error.message', 'test');
      expect(logEntry).to.have.deep.property('error.stack');
      expect(logEntry).to.not.have.deep.property('error.code'); // no more
      expect(logEntry).to.have.deep.property('error.bar', 'baz'); // new one
      expect(logEntry).to.have.property('message', 'test');
    });
  });

});
