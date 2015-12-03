# winston-error
[![Build Status](https://travis-ci.org/lemonde/winston-error.svg?branch=master)](https://travis-ci.org/lemonde/winston-error)
[![Dependency Status](https://david-dm.org/lemonde/winston-error.svg?theme=shields.io)](https://david-dm.org/lemonde/winston-error)
[![devDependency Status](https://david-dm.org/lemonde/winston-error/dev-status.svg?theme=shields.io)](https://david-dm.org/lemonde/winston-error#info=devDependencies)

Error helper for winston.

Add a decorator on `winston.error()` which, when an error is passed as first argument,
also adds it in metadata and converts the call to a standard winston `(message, metadata, ...)`.
The full error object is not added, only fields `.message`, `.stack` and `.code` are copied by default.


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

Copied fields can be explicitly set :

```js
winstonError(logger, {
  pickedFields: [
    'message',
    'stack',
    'triage'
  ]
});

logger.error(new Error('My error')); // will add message, stack and triage in meta
```


## License

MIT


## contributing

```bash
npm i
npm test
```
