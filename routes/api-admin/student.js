var express = require('express'),
    router = express.Router(),
    StudentService = require('../../businessLogic').StudentService,
    util = require('util'),
    mLogger = require('../../libs/logger');

router.get('/', function(req, res, next){
    var page = req.query.$page;
    StudentService.admGetStudentList(page).then(
        function(data){
            return res.msend(1, data);
        },
        function (error) {
            mLogger.error(mLogger.module.admin, "Cannot retrieve students", {
                error: error.toString()
            });
            return res.msend(-1);
        }
    );
})

module.exports = router;