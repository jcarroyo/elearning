var Q = require('q'),
    models = require('../../models').models,
    types = require('../../models').types,
    SproutVideo = require('../../sproutvideo'),
    securityHelper = require('../../libs/security'),
    uuid = require('uuid'),
    emailHelper = require('../../libs/emailHelper'),
    async = require('async'),
    queueTasks = require('../../libs/queueTasks');

var updateLastLogin = function(studentID){
    queueTasks.push(function(){
        return models.Student.update({_id: studentID}, {$set: {lastLogin: (new Date).getTime()}});
    })
}

var accountExists = function(email){
    return models.Student.findOne({email: email}).exec();
}

var createStudentAccount = function(user){
    var d = Q.defer();

    var activationCode = uuid.v4();

    var pass = securityHelper.obfuscatePassword(user.password);
    var student = new models.Student({
        name: user.name,
        email: user.email,
        password: pass,
        createdDate: (new Date).getTime(),
        status: types.StudentStatus.pendingToActivate,
        activationCode: activationCode
    });
    student.save(function(err, doc){
        if(err){
            d.reject(err);
        }else{
            queueTasks.push(function(){return emailHelper.sendCreatedAccountActivationLink({
                name: user.name,
                email: user.email,
                activationCode: activationCode
            })});

            d.resolve(doc);
        }
    });

    return d.promise;
};

var loginStudentAccount = function(login){
    var d = Q.defer();
    var hashPassword = securityHelper.obfuscatePassword(login.password);

    var filters = {
            email: login.email,
            password: hashPassword
        },
        fields = {
            _id: true,
            name: true,
            email: true,
            password: true,
            status: true
        };



    models.Student.find(filters, fields, function(err, document){
        if(err){
            d.reject(err);
        }else{
            if(document.length == 1){
                d.resolve(document[0]);
            }else{
                d.resolve(null);
            }
        }
    });

    return d.promise;
};

var activateAccountByActivationCode = function(activationCode){
    var d = Q.defer();
    models.Student.update({activationCode: activationCode}, {$set: {status: types.StudentStatus.active, activationCode: undefined}}, function(error, result){
        if(error){
            d.reject(error);
        }else{
            d.resolve(result.nModified);
        }
    });
    return d.promise;
}

var getStudentProfile = function(studentID){
    var d = Q.defer();
    var fields = {
        _id: false,
        name: true,
        email: true
    }
    models.Student.findById(studentID, fields, function(err, student){
        if(err){
            return d.reject(err);
        }
        return d.resolve(student);
    })
    return d.promise;
}

var getStudentCourses = function(studentID){
    var d = Q.defer();

    async.waterfall([
        function(callback){
            models.StudentCourses.find({studentID: studentID}, function(err, result){
                return callback(err, result);
            })
        },
        function(studentCourses, callback){
            if(studentCourses){
                var fields = {
                    _id: true,
                    title: true,
                    friendlyUrlName: true
                }
                var ids = [];
                studentCourses.forEach(
                    function(sc){
                        ids.push(sc.courseID);
                    }
                );
                models.Course.find({_id: {$in: ids}}, fields, function(err, courses){
                    return callback(err, studentCourses, courses);
                })
            }else {
                return callback(null)
            }
        }

    ],function(err, studentCourses, courses){
        if(err){
            return d.reject(err);
        }
        if(studentCourses && courses){
            var result = [];
            studentCourses.forEach(function(sc){
                var title = '', friendlyUrlName = '';
                for(var i = 0; i < courses.length; i++){
                    var course = courses[i];
                    if(course._id.equals(sc.courseID)){
                        title = course.title;
                        friendlyUrlName = course.friendlyUrlName;
                        break;
                    }
                }
                result.push({
                    enrolledDate: sc.enrolledDate,
                    courseID: sc.courseID,
                    courseTitle: title,
                    friendlyUrlName: friendlyUrlName
                });
            });
        }
        return d.resolve(result);
    });

    return d.promise;
}

var changeStudentPassword = function(studentID, currentPassword, newPassword){
    var d = Q.defer();

    models.Student.findById(studentID, function(err, student){
        if(err){
            return d.reject(err);
        }
        if(!student){
            return d.reject("The user doesn't exists");
        }

        /*var oldPasswordObfuscate = securityHelper.obfuscatePassword(currentPassword);
        if(oldPasswordObfuscate != student.password){
            return d.reject("The current password is incorrect");
        }*/
        var newPasswordObfuscate = securityHelper.obfuscatePassword(newPassword);

        models.Student.update({_id: studentID}, {$set: {password: newPasswordObfuscate}}, function(err){
            if(err){
                return d.reject(err);
            }
            return d.resolve(true);
        })
    })

    return d.promise;
}

var updateStudentProfile = function(student){
    var d = Q.defer();
    models.Student.update({_id: student.id}, {$set: {name: student.name}}, function(error){
        if(error){
            return d.reject(error);
        }
        return d.resolve(true);
    })
    return d.promise;
}

module.exports = {
    createStudentAccount: createStudentAccount,
    loginStudentAccount: loginStudentAccount,
    accountExists: accountExists,
    updateLastLogin: updateLastLogin,
    activateAccountByActivationCode: activateAccountByActivationCode,
    getStudentProfile: getStudentProfile,
    getStudentCourses: getStudentCourses,
    changeStudentPassword: changeStudentPassword,
    updateStudentProfile: updateStudentProfile
};