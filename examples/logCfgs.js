'use strict';
const _ = require('lodash')
const senecaLogTrans = require('../lib/index.js') // The seneca-logtrans-plugin
const seneca = require('seneca')
const su = seneca.util
const jsyaml = require('js-yaml')

const timeout = 3 * 60 * 1000
const useYaml = true

/*
const isLevel = function(level) {
    return function(value, idx, coll) {
        return (value.level === level)
    }
}*/

const yamlDumpCfg = {
    sortKeys: true,
    indent: 4,
    skipInvalid: true
}

function pad(content, length) {
    content = content || ''

    while (content.length < length) {
        content = content + ' '
    }

    return content
}

const printLogEntry = function(e) {
    const seneca = e.seneca || '-'
    const plugin_tag = e.plugin_tag || '-'
    const kind = pad(e.kind, 7)
//    const level = pad(e.level, 6)
    const caseProp = pad(e.case, 7)
    const plugin_name = e.plugin_name || '-'
    const origin = `[${seneca}/${plugin_name}/${plugin_tag}]`
    if (_.includes(['act', 'add', 'options', 'plugin'], e.kind)) {
        if('act' === e.kind) {
            console.log(`${origin} ${kind} ${caseProp} ${e.pattern}`)
            if (useYaml) {
                console.log(jsyaml.safeDump({ msg: su.clean(e.msg) }, yamlDumpCfg))
            } else {
                console.log(JSON.stringify(su.clean(e.msg), null, '   '), '\n')
            }
        } else {
            console.log(`${origin} ${kind} ${caseProp} ${e.pattern}`)
        }
    }
    if (_.includes(['user'], e.kind)) {
        console.log(`${origin} ${kind}`)
        if (useYaml) {
            console.log(jsyaml.safeDump({ payload: su.clean(e.payload) }, yamlDumpCfg))
        } else {
            console.log(JSON.stringify(su.clean(e.payload), null, '    '), '\n')
        }
    }
    if (_.includes(['notice'], e.kind)) {
        console.log(`${origin} ${kind}`, JSON.stringify(su.clean(e.notice), null, ''))
    }
    console.log('_________________________________________\n')
}

module.exports = {
    cfgFull: {
        test: true,
        log: {
            basic: 'standard'
        },
        timeout: timeout
    },

    cfgSimple: {
        internal: {
            logger: senecaLogTrans
        },
        'seneca-logtrans-plugin': {
            filterFun: function(logEntry) {
                return (_.includes(['act', 'user'], logEntry.kind))
            },
            processFun: function(logEntry) { printLogEntry(logEntry) }
        },
        log: {
            basic: "any"
        },
        timeout: timeout
    }
}
