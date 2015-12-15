'use strict';

var _ = require('lodash');

/**
 * Expose module.
 */

module.exports = function winstonLoggerDecorator(logger, options) {

  var originalLogger = _.clone(logger); // not deep

  options = options || {};
  options.decoratedLevels = options.decoratedLevels || [
    'error'
  ];
  options.pickedFields = options.pickedFields || {
    name: undefined,
    message: undefined,
    stack: undefined
  };
  var pickedKeys = _.keys(options.pickedFields);

  function winstonCallRewriter(loggerMethod, message, metadata) {

    if (! (message instanceof Error)) {
      // this decorator isn't needed
      return loggerMethod.apply(logger, _.drop(arguments, 1));
    }

    var error = message;

    // Keep original metadata safe.
    metadata = _.clone(metadata || {});

    // Copy only whitelisted error fields in metadata,
    // providing an optional default value
    metadata.error = _.defaults(
      _.pick(error, pickedKeys),
      options.pickedFields
    );

    // Replace message by error message.
    message = error.message;

    // Log with arguments re-arranged.
    var args = [message, metadata].concat(_.drop(arguments, 3));
    loggerMethod.apply(logger, args);
  }

  options.decoratedLevels.forEach(function(level) {
    logger[level] = _.partial(winstonCallRewriter, originalLogger[level]);
  });
};
