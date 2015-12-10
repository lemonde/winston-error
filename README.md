# winston-error
[![Build Status](https://travis-ci.org/lemonde/winston-error.svg?branch=master)](https://travis-ci.org/lemonde/winston-error)
[![Dependency Status](https://david-dm.org/lemonde/winston-error.svg?theme=shields.io)](https://david-dm.org/lemonde/winston-error)
[![devDependency Status](https://david-dm.org/lemonde/winston-error/dev-status.svg?theme=shields.io)](https://david-dm.org/lemonde/winston-error#info=devDependencies)

Error helper for winston.

Add a decorator on `winston.error()` (by default, customizable) which, when an error is passed as first argument,
also adds it in metadata and converts the call to a standard winston `(message, metadata, ...)`.
The full error object is not added, only standard fields `.name`, `.message` and `.stack` are copied (by default, customizable).


## Install

```
npm install winston-error
```

## Usage

```js
var winston = require('winston');
var winstonError = require('winston-error');

var logger = new winston.Logger();
winstonError(logger);

logger.error(new Error('My error')); // will add message, stack and code in meta
```

Copied fields can be explicitly selected, with a default value :

```js
winstonError(logger, {
  pickedFields: {
    name: undefined,
    message: undefined,
    stack: undefined,
    status: 500
  }
});

logger.error(new Error('My error')); // will copy name, message, stack and status in meta
```

Decorated levels can be explicitly selected :

```js
winstonError(logger, {
  decoratedLevels: [
    'error',
    'warn'
  ]
});

logger.error(new Error('My error')); // will copy name, message and stack in meta
logger.warn(new Error('My error')); // will copy name, message and stack in meta
```


## License

MIT


## contributing

```bash
npm i
npm test
```
