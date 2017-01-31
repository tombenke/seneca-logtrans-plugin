const expect = require('chai').expect
const plugin = require('./index')
const pluginName = "seneca-logtrans-plugin"
const _ = require('lodash')

const seneca = require('seneca')

const senecaOptions = {
    internal: {
        logger: plugin
    },
    test: true,
    log: {
        basic: "any"
    }
}

const isLevel = function(level) {
    return function(value, idx, coll) {
        return (value.level === level)
    }
}

const printPluginLogEntry = function(logEntry) {
    console.log(logEntry.when, 'plugin', logEntry.plugin_name, logEntry.plugin_tag, logEntry.case)
}

describe(`${pluginName}`, function() {

    it('Count user-kind entries', function(done) {
        let log = []

        senecaOptions['seneca-logtrans-plugin'] = {
            filterFun: function(logEntry) { return logEntry.kind === 'user' },
            processFun: function(logEntry) { log.push(logEntry) }
        }
        var s = seneca(senecaOptions).ready(function() {
            s.log.fatal('fatal log level')
            s.log.error('error log level')
            s.log.warn('warn log level')
            s.log.info('info log level')
            s.log.debug('debug log level')
            s.log.debug('debug with some data', { someField: 42 }, 24, [1, 2, 3])
            s.act('role:seneca,cmd:close', function(err, resp) {
                expect(_.filter(log, isLevel('fatal')).length).to.equal(1)
                expect(_.filter(log, isLevel('error')).length).to.equal(1)
                expect(_.filter(log, isLevel('warn')).length).to.equal(1)
                expect(_.filter(log, isLevel('debug')).length).to.equal(2)
                done(err)
            })
        })
    })

    it('Collect plugin entries', function(done) {
        let log = []

        senecaOptions['seneca-logtrans-plugin'] = {
            filterFun: function(logEntry) { return logEntry.kind === 'plugin' },
            processFun: function(logEntry) { log.push(logEntry); printPluginLogEntry(logEntry) }
        }
        var s = seneca(senecaOptions).ready(function() {
            s.act('role:seneca,cmd:close', function(err, resp) {
                console.log(log)
                done(err)
            })
        })

    })
})
