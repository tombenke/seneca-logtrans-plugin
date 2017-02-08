/**
 * This example script prints out a table to show the properties
 * that are carried together with a specific `kind` of log entry.
 */
const logTransPlugin = require('../lib/index')
const _ = require('lodash')

const seneca = require('seneca')

var logKeyStats = {}
var logCaseStats = {}

const addStats = function(kind, caseProp, keys) {
    if (! _.has(logKeyStats, kind)) {
        logKeyStats[kind] = {}
    }
    logKeyStats[kind] = _.union(keys, logKeyStats[kind])

    if (! _.isUndefined(caseProp)) {
        if (! _.has(logCaseStats, kind)) {
            logCaseStats[kind] = new Array(caseProp)
        } else {
            logCaseStats[kind] = _.union(new Array(caseProp), logCaseStats[kind])
        }
    }
}

const addLogStats = function(payload) {
    addStats(payload.kind, payload.case, _.keys(payload))
}

function pad(content, length) {
    content = content || ''

    while (content.length < length) {
        content = content + ' '
    }

    return content
}

const printLogStats = function() {
    const strcmp = function(a, b) {
        if (a>b) return 1
        if (b>a) return -1
        return 0
    }

    let allProps = []
    let allKind = _.keys(logKeyStats).sort(strcmp)
    _.mapKeys(logKeyStats, function(value, key) {
        allProps = _.union(allProps, value)
        //console.log(key, JSON.stringify(value, null, ''))
    })
    let kinds = '            '
    _.map(allKind, function(value, key) {
        kinds += pad(value, 10)
    })
    console.log(kinds)
    _.map(allProps.sort(strcmp), function(prop) {
            let found = pad(prop, 12)
            _.map(allKind, function(value, key) {
                found += pad((_.indexOf(logKeyStats[value], prop) < 0) ? '   ' : ' + ', 10)
            })
            console.log(found)
        })

    // Print case stats
    console.log('\n\nkind:      case:\n================')
    _.map(logCaseStats, function(value, key) {
        console.log(pad(key, 10), JSON.stringify(logCaseStats[key], null, ''))
    })
}

const senecaOptions = {
    internal: {
        logger: logTransPlugin
    },
    log: {
        basic: "any"
    },
    "seneca-logtrans-plugin": {
        processFun: addLogStats
    }
}

var s = seneca(senecaOptions).ready(function() {
    // Do something here
    s.log.debug('This is a debug message', { text: "Some text..." } )
    s.act('role:seneca,cmd:close', function(err, resp) {
        printLogStats()
    })
})
