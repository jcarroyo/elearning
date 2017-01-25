var express = require('express'),
    router = express.Router(),
    CourseService = require('../../businessLogic').CourseService,
    CatalogService = require('../../businessLogic').CatalogService,
    StudentService = require('../../businessLogic').StudentService,
    CoachService = require('../../businessLogic').CoachService,
    AdminService = require('../../businessLogic').AdminService,
    SproutVideo = require('../../sproutvideo'),
    util = require('util'),
    mLogger = require('../../libs/logger');

router.get('/categories', function(req, res, next) {
    CatalogService.getCategories().then(
        function(data) {
            return res.msend(1, data);
        },
        function(error) {
            mLogger.error(mLogger.module.admin, "Cannot retrieve categories", {
                error: error.toString()
            });
            return res.msend(-1);
        });
})

router.get('/video/generateUploadToken', function(req, res, next) {
    var courseID = req.query.courseID;
    var sectionID = req.query.sectionID;
    var lessonID = req.query.lessonID;
    if (courseID == undefined || courseID == "") {
        mLogger.error(mLogger.module.admin, "Cannot generate video upload token", {
            error: "missing field [courseID]"
        });
        return res.msend(0, null, "missing field [courseID]");
    }
    if (sectionID == undefined || sectionID == "") {
        mLogger.error(mLogger.module.admin, "Cannot generate video upload token", {
            error: "missing field [sectionID]"
        });
        return res.msend(0, null, "missing field [sectionID]");
    }
    if (lessonID == undefined || lessonID == "") {
        mLogger.error(mLogger.module.admin, "Cannot generate video upload token", {
            error: "missing field [lessonID]"
        });
        return res.msend(0, null, "missing field [lessonID]");
    }

    //todo: set in a config file
    var return_url = util.format("http://www.techouse.com.pe/admin/course/%s/section/%s/lesson/%s/videoUploaded", courseID, sectionID, lessonID);
    SproutVideo.getTokenVideoUpload(return_url).then(function(data) {
        return res.msend(1, data);
    }, function(error) {
        mLogger.error(mLogger.module.admin, "Cannot generate video upload token", {
            error: error.toString()
        });
        return res.msend(-1);
    });
})

router.get('/currency', function(req, res, next) {
    return res.msend(1, CourseService.admGetCurrencyList());
})

router.put('/course/:courseID/status', function(req, res, next) {
    var courseID = req.params.courseID,
        status = req.body.status;
    CourseService.admUpdateCourseStatus(courseID, status).then(
        function(data) {
            return res.msend(1, data);
        },
        function(error) {
            mLogger.error(mLogger.module.admin, "Cannot update course status", {
                error: error.toString(),
                courseID: courseID,
                status: status
            });
            return res.msend(-1);
        })
})

router.get('/lookup/coaches', function(req, res, next) {
    CoachService.getCoachesLookUp().then(
        function(data) {
            return res.msend(1, data);
        },
        function(error) {
            mLogger.error(mLogger.module.admin, "Cannot retrieve coaches lookup", {
                error: error.toString()
            });
            return res.msend(-1);
        }
    );
})

router.post('/admAccount', function(req, res, next) {
    var admin = req.body;
    AdminService.createAdmin(admin).then(
        function(data) {
            return res.msend(1, admin);
        },
        function(error) {
            mLogger.error(mLogger.module.admin, "Cannot create admin account", {
                error: error.toString(),
                admin: admin
            });
            return res.msend(-1);
        }
    )
})

module.exports = router;