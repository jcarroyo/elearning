var express = require('express'),
    router = express.Router(),
    CourseService = require('../../businessLogic').CourseService,
    CoachService = require('../../businessLogic').CoachService,
    AdminService = require('../../businessLogic').AdminService,

    //https://github.com/expressjs/multer
    multer  = require('multer'),
    upload = multer({dest:'tmpUploads/'}),
    util = require('util');


router.post('/login', function(req, res, next){
    var login = req.body.login;
    var password = req.body.password;
    AdminService.login(login, password).then(
        function(adminAccount){
            req.session.user = adminAccount;
            res.redirect('/admin');
        },
        function(error){
            console.log(error)
            res.redirect('/admin');
        }
    )
});

router.get('/logout', function(req, res, next){
    req.session.user = undefined;
    res.redirect('/admin');
})

router.get('/', function(req, res, next){
    res.render('admin/index');
})

router.get('/courses', function(req, res, next){
    res.render('admin/courses');
})

router.get('/create-course', function(req, res, next){
    res.render('admin/create-course');
})

router.get('/create-course-content', function(req, res, next){
    res.render('admin/create-course-content');
})

router.get('/course/:courseID/section/:sectionID/lesson/:lessonID/videoUploaded', function(req, res, next){
    var successful = req.query.successful;
    var videoID = req.query.video_id;
    var courseID = req.params.courseID;
    var lessonID = req.params.lessonID;
    var sectionID = req.params.sectionID;

    console.log("success", successful);

    var url = util.format("/admin/create-course-content?courseID=%s",courseID);

    if(successful){
        CourseService.admUpdateLessonVideoInformation(courseID, sectionID, lessonID, videoID).then(
            function(course){
                res.redirect(url);
            },
            function(error){
                console.log(error);
                res.redirect(url);
            }
        );
    }else{
        res.redirect(url); //check this...maybe the parameters doesn't arrive
    }
})

router.get('/students', function(req, res, next){
    res.render('admin/students');
})

router.get('/coaches', function(req, res, next){
    res.render('admin/coaches');
})

router.get('/coach', function(req, res, next){
    res.render('admin/coach');
})

router.get('/create-course-images', function(req, res, next){
    res.render('admin/course-images');
})

var courseImagesUpload = upload.fields([
    {name: 'largeImage', maxCount: 1},
    {name: 'smallImage', maxCount: 1}
]);
router.post('/create-course-images', courseImagesUpload, function(req, res, next) {
    var courseID = req.body.courseID;
    CourseService.admUpdateCourseImages(courseID, req.files).then(
        function (result) {
            res.redirect('/admin/courses');
        },
        function (error) {
            console.log(error);
            res.redirect('/admin/courses');
        }
    );
})

var coachImagesUpload = upload.fields([
    {name: 'coachImage', maxCount: 1}
])

router.post('/coach/:coachID/image', coachImagesUpload, function(req, res, next){
    var coachID = req.params.coachID;
    var url = util.format("/admin/coach?coachID=%s", coachID);
    CoachService.admCoachUpdateImages(coachID, req.files).then(
        function (result) {
            res.redirect(url);
        },
        function (error) {
            console.log(error);
            res.redirect(url);
        }
    );
})

router.get('/students/:studentID', function(req, res, next){
    res.render('admin/studentDetail')
})

router.get('/logs', function(req, res, next){
    res.render('admin/logs')
})

module.exports = router;