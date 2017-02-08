/**
 * This example demonstrates how to filter and format the seneca log
 * to make the whole process easier to follow.
 * The configuration is placed into the `logCfgs.js` file.
 */
const logCfgs = require('./logCfgs')
const seneca = require('seneca')(logCfgs.cfgSimple)

seneca.ready(function() {
    seneca.log.debug('This is a debug message', { text: "Some text..." } )
    seneca.act('role:seneca,cmd:close', function(err, resp) {
        console.log('Good bye!')
    })
})
