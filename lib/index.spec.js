const expect = require('chai').expect
const plugin = require('./index')
const pluginName = "seneca-logtrans-plugin"
const _ = require('lodash')

const seneca = require('seneca')
const su = seneca.util
const senecaOptions = {
    internal: {
        logger: plugin
    },
    log: {
        basic: "any"
    }
}

const isLevel = function(level) {
    return function(value, idx, coll) {
        return (value.level === level)
    }
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
    const level = pad(e.level, 6)
    const caseProp = pad(e.case, 7)
    const origin = pad(`[${seneca}/${e.plugin_name}/${plugin_tag}]`, 16)
    if (_.includes(['act', 'add', 'options', 'plugin'], e.kind)) {
        if('act' === e.kind) {
            console.log(`${e.when} ${level} ${origin} ${kind} ${caseProp} ${e.pattern}`, JSON.stringify(su.clean(e.msg), null, ''))
            // console.log('    ', JSON.stringify(e.msg, null, '   '), '\n')
        } else {
            console.log(`${e.when} ${level} ${origin} ${kind} ${caseProp} ${e.pattern}`)
        }
    }
    if (_.includes(['user'], e.kind)) {
        console.log(`${e.when} ${level} ${origin} ${kind}`, JSON.stringify(e.payload, null, ''))
    }
    if (_.includes(['notice'], e.kind)) {
        console.log(`${e.when} ${level} ${origin} ${kind}`, JSON.stringify(e.notice, null, ''))
    }
}

describe(`${pluginName}`, function() {

    it('Print out all entries with default options', function(done) {
        var s = seneca(senecaOptions).ready(function() {
            s.act('role:seneca,cmd:close', function(err, resp) {
                expect(err).to.equal(null)
                done(err)
            })
        })
    })

    it('Print out "act" entries', function(done) {
        let log = []

        senecaOptions['seneca-logtrans-plugin'] = {
            filterFun: function(logEntry) { return _.includes(['act'], logEntry.kind) },
            processFun: function(logEntry) { log.push(logEntry); printLogEntry(logEntry) }
        }
        var s = seneca(senecaOptions).ready(function() {
            s.act('role:seneca,cmd:close', function(err, resp) {
                expect(err).to.equal(null)
                expect(log.length).to.equal(6)
                done(err)
            })
        })
    })

    it('Print out "plugin" entries', function(done) {
        let log = []

        senecaOptions['seneca-logtrans-plugin'] = {
            filterFun: function(logEntry) { return _.includes(['plugin'], logEntry.kind) },
            processFun: function(logEntry) { log.push(logEntry); printLogEntry(logEntry) }
        }
        var s = seneca(senecaOptions).ready(function() {
            s.act('role:seneca,cmd:close', function(err, resp) {
                expect(err).to.equal(null)
                expect(log.length).to.equal(3)
                done(err)
            })
        })
    })

    it('Print out "notice" entries', function(done) {
        let log = []

        senecaOptions['seneca-logtrans-plugin'] = {
            filterFun: function(logEntry) { return _.includes(['notice'], logEntry.kind) },
            processFun: function(logEntry) { log.push(logEntry); printLogEntry(logEntry) }
        }
        var s = seneca(senecaOptions).ready(function() {
            s.act('role:seneca,cmd:close', function(err, resp) {
                expect(err).to.equal(null)
                expect(log.length).to.equal(2)
                done(err)
            })
        })
    })

    it('Count user-kind entries', function(done) {
        let log = []

        senecaOptions['seneca-logtrans-plugin'] = {
            filterFun: function(logEntry) { return logEntry.kind === 'user' },
            processFun: function(logEntry) { log.push(logEntry); printLogEntry(logEntry)  }
        }
        var s = seneca(senecaOptions).ready(function() {
            s.log.fatal('fatal log level')
            s.log.error('error log level')
            s.log.warn('warn log level')
            s.log.info('info log level')
            s.log.debug('debug log level')
            s.log.debug('debug with some data', { someField: 42 }, 24, [1, 2, 3])
            s.act('role:seneca,cmd:close', function(err, resp) {
                expect(err).to.equal(null)
                expect(_.filter(log, isLevel('fatal')).length).to.equal(1)
                expect(_.filter(log, isLevel('error')).length).to.equal(1)
                expect(_.filter(log, isLevel('warn')).length).to.equal(1)
                expect(_.filter(log, isLevel('debug')).length).to.equal(2)
                done(err)
            })
        })
    })

})
