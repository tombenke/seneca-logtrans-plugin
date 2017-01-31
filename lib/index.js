'use strict'
const pluginName = 'seneca-logtrans-plugin'
const _ = require('lodash')

var options = {
    filterFun: function(logEntry) { return true },
    processFun: function(logEntry) { console.log(logEntry) }
}

module.exports = function(options) {
    const seneca = this

    seneca.add(`init: ${pluginName}`, function(msg, respond) {
        seneca.log.info('init ' + pluginName)
        respond(null)
    })

    return pluginName;
}

const normalizeLogEntry = function(payload) {
    let logEntry = payload

    if (_.isArray(payload)) {
        // transform to internal format
        let payloadItems = []
        for(let i=0; i<payload.length; i++) {
            payloadItems.push(payload[i])
        }
        let userPayload = {
            kind: 'user',
            level: payload.level,
            seneca: payload.seneca,
            when: payload.when,
            payload: payloadItems
        }
        
        logEntry = userPayload
    }
    return logEntry
}

module.exports.preload = function() {
    var seneca = this
    var so = seneca.options()
    
    options = seneca.util.deepextend({}, options, so[pluginName])

    function adapter(context, payload) {
        let logEntry = normalizeLogEntry(payload)
        //console.log(logEntry)
        if (_.isFunction(options.filterFun) && options.filterFun(logEntry)) {
            if (_.isFunction(options.processFun)) {
                options.processFun(logEntry)
            }
        }
    }

    return {
        name: pluginName,
        extend: {
            logger: adapter
        }
    }
}
