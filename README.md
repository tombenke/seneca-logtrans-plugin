# seneca-logtrans-plugin

[![npm version][npm-badge]][npm-url]
[![Build Status][travis-badge]][travis-url]
[![Coveralls][BadgeCoveralls]][Coveralls]

This is an internal plugin to transform and process log entries of seneca instances.

The plugin is based on the `custom_logger` example, given to the seneca itself.

The purpose of this plugin to gain direct control of the logging of seneca, in order to better understand, how it is working.
This plugin also provide a naive but efficient way to control what and how to print out during development and debugging.

Note: This plugin is tested with [seneca v3.2.2](https://github.com/senecajs/seneca/tree/v3.2.2)

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

It is preloaded during the initialization of the seneca instance, and can be configured directly through the instance options.

It has an `adapter()` function, which gets every log entry that is enabled to be processed (see the log config parameters of the instance).

The adapter does three simple things:

1. Converts the user defined log entries into a normalized format, that is:
```JavaScript
   {
        kind: 'user',
        when: <timestamp>,
        level: <log-level>,
        payload: <the user defined content>
   }
   ```
2. If the `filterFun` is defined, then calls it with the normalized log entry as a parameter.
   If this function returns with `false`, then finishes the processing of the log entry. if `true`, then continues with step 3.
3. If the `processFun` is defined, then calls it with the normalized log entry.
   This function defines actually what to do with the log entry (print, save, etc.).

To load the plugin:

This is an internal plugin, so do not load it via the `seneca.use()` function.
Instead, define parameters for this via the options of the `seneca` instance, using the `internal.logger` property,
as you can see in the example below.

See the [lib/index.spec.js](lib/index.spec.js) unit tests or the [examples/logPropStats.js](examples/logPropStats.js)
as an examples that demonstrate how to configure the plugin, and how to define simple functions to filter and process the log entries.

### Options

The plugin has two optional configuration parameters:

- `filterFun`:
   The filter function, which controls the further processing of the log entry.
   It gets the log entry as a parameter, and returns with a `Boolean` value: `true` continues processing, and `false` stops processing.
- `processFun`:
   It gets the log entry as a parameter, and does whatever it wants with that.

The default options of the plugin:
```JavaScript
    {
        filterFun: function(logEntry) { return true },
        processFun: function(logEntry) { console.log(logEntry) }
    }
```

So, in case none of the functions are defined the plugin simply prints out each log entry by default.

The following code snippet demonstrates how to configure the plugin through the seneca instance:

```JavaScript
    const senecaLogTrans = require('seneca-logtrans-plugin')
    const _ = require('lodash')
    
    seneca({
        internal: {
            // Loads the plugin
            logger: senecaLogTrans
        },
        // These are the direct options of the plugin 
        'seneca-logtrans-plugin' : {
            filterFun: function(logEntry) { return _.includes(['act'], logEntry.kind) },
            processFun: function(logEntry) { log.push(logEntry); printLogEntry(logEntry) }
        },
        // Controls what to be forwarded to the adapter function
        log: {
            basic: "any"
        }
    })
```

You can find some examples under the [`examples`](examples) folder.

The [`examples/logPropStats.js`](examples/logPropStats.js) example script prints out a table to show the properties
that are carried together with a specific `kind` of log entry.

The result shows that the possible values of the `kind` property of the log entry are: `act` | `add` | `notice` | `options` | `plugin` `user`.
The rows visualize which log entry property can exist accompanied with a specified `kind`.

```bash
    node examples/logPropStats.js

                act       add       notice    options   plugin    user      
    actid        +                             +         +                  
    caller       +                                                          
    callpoint              +                   +         +                  
    case         +         +                   +         +                  
    client       +                                                          
    duration     +                                                          
    entry        +                                                          
    exports                                              +                  
    gate         +                                                          
    id                     +                                                
    kind         +         +         +         +         +         +        
    level        +         +         +         +         +         +        
    listen       +                                                          
    meta         +                                                          
    msg          +                                                          
    name                   +                             +                  
    notice                           +                                      
    options                          +         +         +                  
    pattern      +         +                   +         +                  
    payload                                                        +        
    plugin_name  +         +                   +         +                  
    plugin_tag   +         +                   +         +                  
    prior        +                                                          
    result       +                                                          
    seneca       +         +         +         +         +         +        
    tag                                                  +                  
    transport    +                                                          
    when         +         +         +         +         +         +
```

The [`examples/logPropStats.js`](examples/logPropStats.js) example demonstrates how to filter and format the seneca log
to make the whole process easier to follow. The configuration is placed into the [`examples/logCfgs.js`](examples/logCfgs.js) file.

```bash
    node examples/logFormatter.js

    [-/transport/-] act     IN      name:transport,plugin:define,role:seneca,seq:1,tag:undefined
    msg:
        name: transport
        plugin: define
        role: seneca
        seq: 1

    _________________________________________

    [-/transport/-] act     DEFAULT name:transport,plugin:define,role:seneca,seq:1,tag:undefined
    msg:
        init: transport

    _________________________________________


    ...
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

