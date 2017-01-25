var Q = require('q'),
    models = require('../../models').models,
    types = require('../../models').types,
    paypal = new(require('../../paypal')),
    async = require('async'),
    emailHelper = require('../../libs/emailHelper'),
    queueTasks = require('../../libs/queueTasks');

var createPayment = function(courseID, studentID){

    /*queueTasks.push(function(){
        return sendEmailPurchaseConfirmation(studentID, courseID)
    });*/

    var fields = {
        title: true,
        shortDescription: true,
        currency: true,
        price: true
    };

    var d = Q.defer();
    models.Course.findById(courseID, fields).then(
        function(course){
            if(course == null){
                d.reject("The course doesn't exists");
                return;
            }

            var currency = "";
            if(course.currency == "S/."){
                currency = "PEN";
            }
            if(course.currency == "$"){
                currency = "USD";
            }

            paypal.generatePayment(course.title, course.price, currency, course.shortDescription).then(
                function(payment){
                    var Payment = new models.Payment({
                        studentID: studentID,
                        createdDate: (new Date).getTime(),
                        courseID: courseID,
                        payID: payment.id,
                        status: types.PaymentStatus.pending
                    });
                    Payment.save(function(error, p){
                        if(error){
                            d.reject(error);
                            return;
                        }
                        var urlRedirect = payment.links[1].href;
                        d.resolve(urlRedirect);
                    });
                },
                function(error){
                    d.reject(error);
                    return;
                }
            );
        },
        function(error){
            d.reject(error);
        }
    );
    return d.promise;
}

var sendEmailPurchaseConfirmation = function(studentID, courseID){
    var d = Q.defer();
    async.parallel({
        student: function(callback){
            models.Student.findOne({_id: studentID}, function(error, student){
                return callback(error, student);
            })
        },
        course: function(callback){
            models.Course.findOne({_id: courseID}, function(error, course){
                return callback(error, course);
            })
        }
    },
    function(error, results){
        if(error){
            return d.reject(error);
        }
        emailHelper.sendPurchaseCourseConfirmation({
            name: results.student.name,
            email: results.student.email
        },{
            title: results.course.title,
            friendlyUrlName: results.course.friendlyUrlName,
            imageUrl: results.course.images.smallImage.url
        }).then(
            function(result){
                return d.resolve(result);
            },
            function(error){
                return d.reject(error);
            }
        )
    });
    return d.promise;
}

var acceptPayment = function(paymentID, payerID){
    var d = Q.defer();
    paypal.executePayment(paymentID, payerID).then(
        function(payment){
            if(payment.state == "approved"){
                models.Payment.findOne({payID: paymentID}, function(error, payment){
                    if(error){
                        d.reject(error);
                        return;
                    }
                    var studentCourse = new models.StudentCourses({
                        studentID: payment.studentID,
                        courseID: payment.courseID,
                        enrolledDate: (new Date).getTime()
                    });

                    payment.status = types.PaymentStatus.payed;

                    async.parallel([
                        function(callback){
                            studentCourse.save(function(error){
                               return callback(error);
                            });
                        },
                        function(callback){
                            payment.save(function(error){
                                return callback(error);
                            })
                        }
                        ], function(error){
                            if(error){
                                d.reject(error);
                                return;
                            }

                            queueTasks.push(function(){
                                return sendEmailPurchaseConfirmation(payment.studentID, payment.courseID)
                            });

                            d.resolve(payment.courseID);
                        }
                    );
                });
            }else{
                //todo: check this
                d.reject("Payment refused");
                return;
            }
        },
        function(error){
            d.reject(error);
        }
    );
    return d.promise;
}

module.exports = {
    createPayment: createPayment,
    acceptPayment: acceptPayment
};