var express = require('express'),
    router = express.Router(),
    paypal = new(require('../../paypal')),
    util = require('util'),
    CourseService = require('../../businessLogic').CourseService,
    PaymentService = require('../../businessLogic').PaymentService,
    AccountService = require('../../businessLogic').AccountService;

router.get('/', function(req, res, next) {
  res.render('students/index', {});
})

router.get('/catalog', function(req, res, next){
  res.render('students/catalog', {});
})

router.get('/login', function(req, res,next){
  res.render('students/login', {});
});

router.get('/signup', function (req, res, next) {
  res.render('students/signup', {});
})

router.get('/about', function (req, res, next) {
  res.render('students/about', {});
})

router.get('/course/:friendlyUrlName', function(req, res, next){
  var friendlyUrlName = req.params.friendlyUrlName;
  res.render('students/course', {friendlyUrlName: friendlyUrlName});
})

router.get('/accept-payment', function(req, res, next){
  var paymentID = req.query.paymentId;
  var payerID = req.query.PayerID;
  PaymentService.acceptPayment(paymentID, payerID).then(function(courseID){
    CourseService.getCourseByID(courseID).then(
        function(course){
          if(course){
            var url = util.format("/course/%s", course.friendlyUrlName);
            res.redirect(url);
            return;
          }
          res.redirect('/catalog');
        },
        function(error){
          console.log(error);
          res.redirect('/catalog');
        }
    )
  }, function(error){
    console.log(error);
    res.redirect('/catalog');
  });
})

router.get('/cancel-payment', function(req, res, next){
  res.redirect('/catalog');
})

router.get('/course/:friendlyUrlName/lesson/:lessonID', function(req, res, next){
  res.render('students/lesson');
})

router.get('/account/student/activateAccount' ,function(req, res, next){
    var code = req.query.ac;
    if(!code){
        return res.json("invalid activation code");
    }
    console.log("activation code", code);
    AccountService.activateAccountByActivationCode(code).then(function(result){
        if(result){
            return res.redirect('/?activated=true')
        }else {
            return res.redirect('/?activated=false')
        }
    },function(error){
        console.log(error);
        return res.redirect('/?activated=false')
    });
})

router.get('/me', function(req, res, next){
    res.render('students/studentProfile')
})

router.get('/courses/material/:materialID', function(req, res, next){
    var materialID = req.params.materialID;
    CourseService.getMaterial(materialID).then(
        function(result){
            if(result) {
                var file = __dirname + '/../../courseMaterial/' + result.fileName;
                return res.download(file);
            }
            return res.download(null);
        },
        function(error){
            console.log(error);
            return res.download(null);
        }
    )
})

module.exports = router;
