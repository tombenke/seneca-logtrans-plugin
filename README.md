# seneca-logtrans-plugin

[![npm version][npm-badge]][npm-url]
[![Build Status][travis-badge]][travis-url]
[![Coveralls][BadgeCoveralls]][Coveralls]

This is an internal plugin to transform and process log entries of seneca instances.

The purpose of this plugin to gain direct control of the logging of seneca, in order to better understand, how it is working.
This plugin also provide a naive but efficient way to control what and how to print out during development and debugging.

## Prerequisites

No preprequisites.

## Installation

Run the install command:

    npm install

Run tests:

    npm test

To obtain coverage, run:

    npm coverage

## Usage

The plugin is based on the `custom_logger` example, given to the seneca itself. 
It is preloaded during the initialization of the seneca instance, and can be configured directly through the instance options.

It has an `adapter()` function, whic gets every log entry that is enabled to processed (see the log config parameters of the instance).

The adapter does three simple things:

1. Converts the user defined log entries into a normalized format, that is:
   `{ kind: 'user', when: <timestamp>, level: <log-level>, payload: <the user defined content> }`
2. If the `filterFun` is defined, then calls it with the normalized log entry as a parameter.
   If this function returns with `false`, then finishes the processing of the log entry. if `true`, then continues with step 3.
3. If the `processFun` is defined, then calls it with the normalized log entry.
   The use can define within this function, what to do with the log entry (print, save, etc.).

To load the plugin:

This is an internal plugin, so do not load it via the `seneca.use()` function.
Instead, define parameters for this via the options of the `seneca` instance, using its plugin name, that is `seneca-logtrans-plugin`.

See the [lib/index.spec.js](lib/index.spec.js) unit tests as an example how to configure the plugin, and how to define simple functions
to filter and process the log entries.

### Options

The plugin has two optional configuration parameters:

- `filterFun`:
   The filter function, which controls the further processing of the log entry.
   It gets the log entry as a parameter, and returns with a `Boolean` value: `true` continues processing, and `false` stops processing.
- `processFun`:
   It gets the log entry as a parameter, and does whatever it wants with that.

The default options of the plugin:
```JavaScript:
    {
        filterFun: function(logEntry) { return true },
        processFun: function(logEntry) { console.log(logEntry) }
    }
```

So, in case none of the functions are defined, then the plugin simply prints out each log entry.

The following code snippet demonstrates how to configure the plugin through the seneca instance:

```JavaScript
    seneca({
    internal: {
        // Loads the plugin
        logger: 'seneca-logtrans-plugin'
    },
    // Controls what to be forwarded to the adapter function
    test: true,
    log: {
        basic: "any"
    },
    // These are the direct options of the plugin 
    'seneca-logtrans-plugin' : {
            filterFun: function(logEntry) { return _.includes(['act'], logEntry.kind) },
            processFun: function(logEntry) { log.push(logEntry); printLogEntry(logEntry) }
        }
    )
```

### Actions

The plugin provides no action.

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

