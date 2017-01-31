# seneca-logtrans-plugin

[![npm version][npm-badge]][npm-url]
[![Build Status][travis-badge]][travis-url]
[![Coveralls][BadgeCoveralls]][Coveralls]

internal plugin to transform and process log entries of seneca instances.

## Prerequisites

The plugin needs the following seneca plugins to be used:

- [???](https://www.npmjs.com/package/seneca-???)


## Installation

Run the install command:

    npm install

Run tests:

    npm test

To obtain coverage, run:

    npm coverage

## Usage

To load the plugin:

```JavaScript
    seneca.use('{plugin_name}}', /* options... */ )
```

### Options

There are no options for this plugin.


### Actions

All actions provide results via the standard callback format: `function(error,data){ ... }`.

#### role: seneca-logtrans-plugin, cmd: TBD

TBD

_Parameters:_

- `payload`: ???

_Response:_ 

- None


## References

- [Seneca.js](http://senecajs.org/)
- [How to Write a Seneca Plugin](http://senecajs.org/docs/tutorials/how-to-write-a-plugin.html)

---

This project was generated from the [seneca-plugin-archetype](https://github.com/tombenke/seneca-plugin-archetype)
by the [kickoff](https://github.com/tombenke/kickoff) utility.

[npm-badge]: https://badge.fury.io/js/seneca-logtrans-plugin.svg
[npm-url]: https://badge.fury.io/js/seneca-logtrans-plugin
[travis-badge]: https://api.travis-ci.org/tombenke/seneca-logtrans-plugin.svg
[travis-url]: https://travis-ci.org/tombenke/seneca-logtrans-plugin
[Coveralls]: https://coveralls.io/github/tombenke/seneca-logtrans-plugin?branch=master
[BadgeCoveralls]: https://coveralls.io/repos/github/tombenke/seneca-logtrans-plugin/badge.svg?branch=master

