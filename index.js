var _ = require('lodash');

/**
 * Expose module.
 */

module.exports = function errorRewriterFactory() {
  return function errorRewriter(level, message, metadata) {
    if (! (message instanceof Error)) return metadata;

    // Keep original metadata safe.
    metadata = _.clone(metadata || {});

    // Add error in metadata.
    metadata.error = _.pick(message, 'message', 'stack', 'code');

    return metadata;
  };
};