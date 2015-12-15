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

    describe('decorated methods', function () {
      context('when 1st argument is not an error', function () {
        it('should do nothing', function () {
          logger.error('hello', { world: 42 });
          var logEntry = JSON.parse(logger.transports.memory.errorOutput[0]);
          expect(logEntry).to.have.property('message', 'hello');
          expect(logEntry).to.have.property('world', 42);
        });
      });

      context('when 1st argument is an error', function () {
        it('should log error properly by copying default fields in metadata', function() {
          var err = new Error('test');
          err.bar = 'baz';

          logger.error(err);
          var logEntry = JSON.parse(logger.transports.memory.errorOutput[0]);
          expect(logEntry).to.have.property('message', 'test');
          expect(logEntry).to.have.deep.property('error.name', 'Error');
          expect(logEntry).to.have.deep.property('error.message', 'test');
          expect(logEntry).to.have.deep.property('error.stack');
        });

        it('should keep existing metadata when rewriting call', function() {
          var err = new Error('test');
          err.bar = 'baz'; // non standard error property

          logger.error(err, {foo: 'bar'});
          var logEntry = JSON.parse(logger.transports.memory.errorOutput[0]);
          expect(logEntry).to.have.property('message', 'test');
          expect(logEntry).to.have.property('foo', 'bar');
          expect(logEntry).to.have.deep.property('error.name', 'Error');
          expect(logEntry).to.have.deep.property('error.message', 'test');
          expect(logEntry).to.have.deep.property('error.stack');
          expect(logEntry).to.not.have.deep.property('error.bar'); // not picked since not standard
        });

        it('should decorate only error()', function () {
          var err = new Error('test');

          logger.info(err, {foo: 'bar'});
          var temp = logger.transports.memory.writeOutput;
          var logEntry = JSON.parse(logger.transports.memory.writeOutput[0]);
          expect(logEntry).to.have.property('message', '[Error: test]'); // wasn't decorated
          expect(logEntry).to.have.property('foo', 'bar');
          expect(logEntry).to.not.have.deep.property('error');
        });
      });
    });

    describe('non decorated methods', function () {
      it('should behave like a standard winston call', function() {
        var err = new Error('test');
        err.bar = 'baz';

        logger.info(err);

        var logEntry = JSON.parse(logger.transports.memory.writeOutput[0]);
        expect(logEntry, 'message').to.not.have.property('message');
        expect(logEntry, 'error').to.not.have.property('error');

        expect(logEntry, 'error').to.have.property('bar', 'baz');
      });
    });
  });

  context('with custom parameters', function () {
    beforeEach(function () {
      logger = new winston.Logger({
        transports: [
          new winston.transports.Memory({json: true})
        ]
      });

      winstonError(logger, {
        decoratedLevels: [
          'error',
          'warn'
        ],
        pickedFields: {
          // "name" removed
          message: 'default',
          stack: null,
          foo: null, // added
          bar: null // added
        }
      });
    });

    context('with explicit fields to pick', function () {
      describe('decorated methods', function () {
        it('should decorate properly by copying specified fields in metadata', function() {
          var err = new Error('test');
          err.bar = 'baz';

          logger.error(err);

          var logEntry = JSON.parse(logger.transports.memory.errorOutput[0]);
          expect(logEntry, 'message').to.have.property('message', 'test');
          expect(logEntry, '.name').to.not.have.deep.property('error.name'); // no longer picked
          expect(logEntry, '.message').to.have.deep.property('error.message', 'test');
          expect(logEntry, '.stack').to.have.deep.property('error.stack');
          expect(logEntry, '.foo').to.have.deep.property('error.foo', null); // new one, with its default value
          expect(logEntry, '.bar').to.have.deep.property('error.bar', 'baz'); // new one, with its actual value
        });
      });
    });

    context('with explicit levels to decorate', function () {
      it('should decorate all given levels', function() {
        var err = new Error('test');
        err.bar = 'baz';

        logger.warn(err);

        var logEntry = JSON.parse(logger.transports.memory.writeOutput[0]);
        expect(logEntry, 'message').to.have.property('message', 'test');
        expect(logEntry, '.name').to.not.have.deep.property('error.name'); // no longer picked
        expect(logEntry, '.message').to.have.deep.property('error.message', 'test');
        expect(logEntry, '.stack').to.have.deep.property('error.stack');
        expect(logEntry, '.foo').to.have.deep.property('error.foo', null); // new one, with its default value
        expect(logEntry, '.bar').to.have.deep.property('error.bar', 'baz'); // new one, with its actual value
      });

      it('should NOT decorate non-given levels', function() {
        var err = new Error('test');
        err.bar = 'baz';

        logger.info(err);

        var logEntry = JSON.parse(logger.transports.memory.writeOutput[0]);
        expect(logEntry, 'message').to.not.have.property('message');
        expect(logEntry, 'error').to.not.have.property('error');

        expect(logEntry, 'error').to.have.property('bar', 'baz');
      });
    });
  });

});
