var express = require('express'),
    router = express.Router(),
    util = require('util'),
    mLogger = require('../../libs/logger'),
    LogService = require('../../businessLogic').LogService;

router.get('/logs', function(req, res, next){
    var level = req.query.level,
        page = req.query.page;
    LogService.getLogs(level, page).then(
        function(result){
            res.msend(1, result);
        },
        function(error){
            res.msend(-1);
        }
    );
})

module.exports = router;