var express = require('express'),
    router = express.Router(),
    CourseService = require('../../businessLogic').CourseService,
    util = require('util'),
    mLogger = require('../../libs/logger');

router.get('/:courseID/material', function(req, res, next){
    var courseID = req.params.courseID;

})

router.get('/', function(req, res, next) {
    var category = req.query.category;
    CourseService.admGetCourses(category).then(function(data) {
        return res.msend(1, data);
    }, function(error) {
        mLogger.error(mLogger.module.admin, "Cannot retrieve categories", {
            error: error.toString()
        });
        return res.msend(-1);
    });
})

router.get('/:courseID/description', function(req, res, next) {
    var courseID = req.params.courseID;
    CourseService.admGetCourseDescriptionByID(courseID).then(
        function(data) {
            return res.msend(1, data);
        },
        function(error) {
            mLogger.error(mLogger.module.admin, "Cannot retrieve course description", {
                error: error.toString(),
                courseID: courseID
            });
            return res.msend(-1);
        }
    );
})

router.post('/', function(req, res, next) {
    var course = req.body;
    CourseService.admCreateCourseDescription(course).then(
        function(data) {
            return res.msend(1, data);
        },
        function(error) {
            mLogger.error(mLogger.module.admin, "Cannot create course", {
                error: error.toString(),
                course: course
            });
            return res.msend(-1);
        });
})

router.put('/:courseID', function(req, res, next) {
    var courseID = req.params.courseID;
    var course = req.body;
    CourseService.admUpdateCourseDescription(courseID, course).then(
        function(data) {
            return res.msend(1, data);
        },
        function(error) {
            mLogger.error(mLogger.module.admin, "Cannot modify course", {
                error: error.toString(),
                courseID: courseID,
                course: course
            });
            return res.msend(-1);
        }
    );
})

router.post('/:courseID/course-content/section', function(req, res, next) {
    var courseID = req.params.courseID;
    var section = req.body;
    CourseService.admCourseAddSection(courseID, section).then(
        function(data) {
            return res.msend(1, data);
        },
        function(error) {
            mLogger.error(mLogger.module.admin, "Cannot add course section", {
                error: error.toString(),
                courseID: courseID,
                section: section
            });
            return res.msend(-1);
        }
    );
})

router.post('/:courseID/course-content/section/:sectionID/lesson', function(req, res, next) {
    var courseID = req.params.courseID,
        sectionID = req.params.sectionID,
        lesson = req.body;
    CourseService.admCourseAddLessonToSection(courseID, sectionID, lesson).then(
        function(data) {
            return res.msend(1, data);
        },
        function(error) {
            mLogger.error(mLogger.module.admin, "Cannot add course lesson", {
                error: error.toString(),
                courseID: courseID,
                sectionID: sectionID,
                lesson: lesson
            });
            return res.msend(-1);
        });
})

router.get('/:courseID/contentInfo', function(req, res, next) {
    var courseID = req.params.courseID;
    CourseService.admGetCourseContentInfoByID(courseID).then(
        function(data) {
            return res.msend(1, data);
        },
        function(error) {
            mLogger.error(mLogger.module.admin, "Cannot retrieve course contentInfo", {
                error: error.toString(),
                courseID: courseID
            });
            return res.msend(-1);
        }
    );
})

router.get('/:courseID', function(req, res, next) {
    var courseID = req.params.courseID;
    CourseService.admGetCourseByID(courseID).then(
        function(data) {
            return res.msend(1, data);
        },
        function(error) {
            mLogger.error(mLogger.module.admin, "Cannot retrieve course", {
                error: error.toString(),
                courseID: courseID
            });
            return res.msend(-1);
        });
})

router.delete('/:courseID/course-content/section/:sectionID/lesson/:lessonID', function(req, res, next) {
    var courseID = req.params.courseID,
        sectionID = req.params.sectionID,
        lessonID = req.params.lessonID;
    CourseService.admRemoveCourseLesson(courseID, sectionID, lessonID).then(
        function(data) {
            return res.msend(1, data)
        },
        function(error) {
            mLogger.error(mLogger.module.admin, "Cannot remove course lesson", {
                error: error.toString(),
                courseID: courseID,
                lessonID: lessonID
            });
            return res.msend(-1);
        });
})

module.exports = router;