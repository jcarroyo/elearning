var Q = require('q');
var nconf = require('nconf')
var winston = require('winston');
require('winston-mongodb').MongoDB;

//todo: set unhandled exceptions

var l = new (winston.Logger)({
    transports: [
        new (winston.transports.MongoDB)({
            level: 'info',
            silent: false,
            db: nconf.get("mongodb:uri"),
            collection: "appLog"
        })
    ]
})

function doLog(type, module, message, meta){
    if(!meta){
        meta = {};
    }
    meta.module = module;
    meta.process = process.pid;
    l.log(type, message, meta);
}

module.exports = {
    error: function(module, message, meta){
        doLog('error', module, message, meta);
    },
    warn: function(module, message, meta){
        doLog('warn', module, message, meta);
    },
    info: function(module, message, meta){
        doLog('info', module, message, meta);
    },
    module: {
        student: "student",
        admin: "admin"
    }
}
