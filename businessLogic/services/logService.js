var mLogger = require('../../libs/logger'),
    models = require('../../models').models,
    paginationHelper = require('./paginationHelper');

var getLogs = function(level, page){
    var filter = {}
    if(level){
        filter.level = level;
    }
    return paginationHelper(models.AppLog, filter, {} ,page);
}

module.exports = {
    getLogs: getLogs
}