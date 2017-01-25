var express = require('express'),
    router = express.Router(),
    CourseService = require('../../businessLogic').CourseService,
    PaymentService = require('../../businessLogic').PaymentService,
    expressJwt = require('express-jwt'),
    jwt = require('jsonwebtoken'),
    nconf = require('nconf'),
    mLogger = require('../../libs/logger');

router.get('/:friendlyUrlName', function(req, res, next) {
    var studentID = null;
    if (req.headers.authorization != undefined) {
        var token = req.headers.authorization.replace("Bearer ", "");
        try {
            var student = jwt.verify(token, nconf.get("jwt:secret"));
            studentID = student.id;
        } catch (error) {
            mLogger.warn(mLogger.module.student, "An attempt to use an invalid token", {
                url: req.originalUrl,
                message: error.toString()
            });
        }
    }
    var friendlyUrlName = req.params.friendlyUrlName;
    if (friendlyUrlName) {
        CourseService.getCourseByFriendlyUrlName(friendlyUrlName, studentID).then(
            function(result) {
                if (result) {
                    return res.msend(1, result);
                }
                mLogger.warn(mLogger.module.student, "The course doesn't exists", {
                    url: req.originalUrl,
                    friendlyUrlName: friendlyUrlName
                });
                return res.msend(0, null, "The course doesn't exists");
            },
            function(error) {
                mLogger.error(mLogger.module.student, "Cannot retrieve course", {
                    error: error.toString()
                });
                return res.msend(-1);
            }
        );
    } else {
        mLogger.warn(mLogger.module.student, "Missing friendlyUrlName");
        res.msend(0, null, "Wrong parameter");
    }
})

router.get('/:friendlyUrlName/lessons', function(req, res, next) {
    var friendlyUrlName = req.params.friendlyUrlName;
    var studentID = null;
    if (req.headers.authorization != undefined) {
        var token = req.headers.authorization.replace("Bearer ", "");
        try {
            var student = jwt.verify(token, nconf.get("jwt:secret"));
            studentID = student.id;
        } catch (error) {
            mLogger.warn(mLogger.module.student, "An attempt to use an invalid token", {
                message: error.toString()
            });
        }
    }
    CourseService.getCourseLessonsByFriendlyUrlName(friendlyUrlName, studentID).then(function(result) {
        if (result) {
            return res.msend(1, result);
        }
        mLogger.warn(mLogger.module.student, "The course doesn't exists", {
            url: req.originalUrl,
            friendlyUrlName: friendlyUrlName
        });
        return res.msend(0, null, "The course doesn't exists");
    }, function(error) {
        mLogger.error(mLogger.module.student, "Cannot retrieve course lessons", {
            error: error.toString()
        });
        return res.msend(-1);
    });
})

router.get('/:courseID/buy', function(req, res, next) {
    var studentID = null;
    if (req.headers.authorization != undefined) {
        var token = req.headers.authorization.replace("Bearer ", "");
        try {
            var student = jwt.verify(token, nconf.get("jwt:secret"));
            studentID = student.id;
        } catch (error) {
            mLogger.warn(mLogger.module.student, "An attempt to use an invalid token", {
                url: req.originalUrl,
                message: error.toString()
            });
            return res.msend(-1);
        }
    }
    var courseID = req.params.courseID;
    PaymentService.createPayment(courseID, studentID).then(
        function(url) {
            mLogger.info(mLogger.module.student, "Init process to pay", {
                course: courseID,
                student: studentID
            });
            return res.msend(1, url);
        },
        function(error) {
            mLogger.error(mLogger.module.student, "Cannot genereate payment url", {
                error: error.toString()
            });
            return res.msend(-1);
        }
    );
})

module.exports = router;