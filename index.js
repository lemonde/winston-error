'use strict';

var _ = require('lodash');

/**
 * Expose module.
 */

module.exports = function errorLoggerWrapper(logger, options) {
  var originalErrorLogger = logger.error;
  options = options || {};
  options.pickedFields = options.pickedFields || [
    'name',
    'message',
    'stack'
  ];

  logger.error = function errorRewriter(message, metadata) {
    if (! (message instanceof Error))
      return originalErrorLogger.apply(logger, arguments);

    var error = message;

    // Keep original metadata safe.
    metadata = _.clone(metadata || {});

    // Set the missing whitelisted fields to null by default.
    _.forEach(options.pickedFields, function(key) {
      if (_.isUndefined(error[key]))
        error[key] = null;
    });

    // Add error in metadata, with keys filtered
    metadata.error = _.pick(error, options.pickedFields);

    // Replace message by error message.
    message = error.message;

    // Log with arguments rearanged.
    var args = [message, metadata].concat(_.drop(arguments, 2));
    originalErrorLogger.apply(logger, args);
  };
};
