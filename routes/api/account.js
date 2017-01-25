var express = require('express'),
    router = express.Router(),
    AccountSignUp = require('../../libs/accountSignUp'),
    LoginLogic = require('../../libs/loginLogic'),
    expressJwt = require('express-jwt'),
    jwt = require('jsonwebtoken'),
    nconf = require('nconf'),
    AccountService = require('../../businessLogic').AccountService,
    mLogger = require('../../libs/logger');

router.post('/student/signup', function(req, res, next) {
    var account = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };

    var signUp = new AccountSignUp(account);
    var promise = signUp.createAccount();

    promise.then(function(success) {
        if (success) {
            mLogger.info(mLogger.module.student, "Student account created", {
                name: account.name,
                email: account.email
            });
            res.msend(1, true, null)
        } else {
            mLogger.warn(mLogger.module.student, "Cannot create student account", {
                name: account.name,
                email: account.email,
                message: signUp.message
            });
            res.msend(0, false, signUp.message)
        }
    }, function(error) {
        mLogger.error(mLogger.module.student, "Cannot create account", {
            name: account.name,
            email: account.email,
            error: error
        });
        res.msend(-1);
    });
});

router.post('/student/login', function(req, res, next) {
    var login = {
        email: req.body.email,
        password: req.body.password
    };
    var loginLogic = LoginLogic(login);
    loginLogic.login().then(function(account) {
        if (account) {
            var token = jwt.sign(account, nconf.get('jwt:secret'), {
                expiresIn: nconf.get('jwt:expiresIn'),
                ignoreExpiration: false,
                issuer: true
            });
            var result = {
                token: token,
                userInfo: {
                    name: account.name,
                    email: account.email
                }
            };
            return res.msend(1, result);
        } else {
            return res.msend(0, null, loginLogic.errorMessage);
        }
    }, function(error) {
        mLogger.error(mLogger.module.student, "Cannot login", {
            error: error.toString(),
            user: login.email
        });
        return res.msend(-1);
    });
})

router.get('/student/profile', expressJwt({
    secret: nconf.get('jwt:secret')
}), function(req, res, next) {
    var studentID = req.user.id;
    AccountService.getStudentProfile(studentID).then(
        function(result) {
            return res.msend(1, result);
        },
        function(error) {
            mLogger.error(mLogger.module.student, "Cannot retrieve user profile", {
                error: error.toString(),
                user: studentID
            });
            return res.msend(-1);
        }
    );
})

router.get('/student/courses', expressJwt({
    secret: nconf.get('jwt:secret')
}), function(req, res, next) {
    var studentID = req.user.id;
    AccountService.getStudentCourses(studentID).then(
        function(result) {
            return res.msend(1, result);
        },
        function(error) {
            mLogger.error(mLogger.module.student, "Cannot retrieve user courses", {
                error: error.toString(),
                user: studentID
            });
            return res.msend(-1);
        }
    );
})

router.post('/student/changePassword', expressJwt({
    secret: nconf.get('jwt:secret')
}), function(req, res, next) {
    var currentPassword = req.body.currentPassword,
        newPassword = req.body.newPassword,
        studentID = req.user.id;
    AccountService.changeStudentPassword(studentID, currentPassword, newPassword).then(
        function(result) {
            return res.msend(1, result);
        },
        function(error) {
            mLogger.error(mLogger.module.student, "Cannot change user password", {
                error: error.toString(),
                user: studentID
            });
            return res.msend(-1);
        }
    );
})

router.post('/student/profile', expressJwt({
    secret: nconf.get('jwt:secret')
}), function(req, res, next) {
    var student = {
        id: req.user.id,
        name: req.body.name
    }
    AccountService.updateStudentProfile(student).then(
        function(result) {
            return res.msend(1, result);
        },
        function(error) {
            mLogger.error(mLogger.module.student, "Cannot modify user profile", {
                error: error.toString(),
                user: student.id
            });
            return res.msend(-1);
        }
    )
})

module.exports = router;