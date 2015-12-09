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
      expect(logEntry).to.have.deep.property('error.name', 'Error');
      expect(logEntry).to.have.deep.property('error.message', 'test');
      expect(logEntry).to.have.deep.property('error.stack');
      expect(logEntry).to.have.property('message', 'test');
    });

    it('should keep existing metadata', function() {
      var err = new Error('test');
      err.bar = 'baz'; // non standard error property

      logger.error(err, {foo: 'bar'});
      var logEntry = JSON.parse(logger.transports.memory.errorOutput[0]);
      expect(logEntry).to.have.deep.property('error.name', 'Error');
      expect(logEntry).to.have.deep.property('error.message', 'test');
      expect(logEntry).to.have.deep.property('error.stack');
      expect(logEntry).to.not.have.deep.property('error.bar'); // not picked since not standard
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
        pickedFields: {
          // "name" removed
          message: 'default',
          stack: null,
          foo: null, // added
          bar: null // added
        }
      });
    });

    it('should log error properly by copying only specified fields in metadata', function() {
      var err = new Error('test');
      err.bar = 'baz';

      logger.error(err);

      var logEntry = JSON.parse(logger.transports.memory.errorOutput[0]);
      expect(logEntry, '.name').to.not.have.deep.property('error.name'); // no longer picked
      expect(logEntry, '.message').to.have.deep.property('error.message', 'test');
      expect(logEntry, '.stack').to.have.deep.property('error.stack');
      expect(logEntry, '.foo').to.have.deep.property('error.foo', null); // new one, with its default value
      expect(logEntry, '.bar').to.have.deep.property('error.bar', 'baz'); // new one, with its actual value
      expect(logEntry, 'message').to.have.property('message', 'test');
    });
  });

});
