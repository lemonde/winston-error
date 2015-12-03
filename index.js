var _ = require('lodash');

/**
 * Expose module.
 */

module.exports = function errorLoggerWrapper(logger, options) {
  var originalErrorLogger = logger.error;
  options = options || {};
  options.pickedFields = options.pickedFields || [
    'message',
    'stack',
    'code'
  ];

  logger.error = function errorRewriter(message, metadata) {
    if (! (message instanceof Error))
      return originalErrorLogger.apply(logger, arguments);

    var error = message;

    // Keep original metadata safe.
    metadata = _.clone(metadata || {});

    // Set the code to null by default.
    error.code = _.isUndefined(error.code) ? null : error.code;

    // Add error in metadata.
    metadata.error = _.pick(error, options.pickedFields);

    // Replace message by error message.
    message = error.message;

    // Log error.
    var args = [message, metadata].concat(_.drop(arguments, 2));
    originalErrorLogger.apply(logger, args);
  };
};
