var nconf = require('nconf');
var mongooseOptionConnect = {
    user: nconf.get('mongodb:user'),
    pass: nconf.get('mongodb:pass')
};
var mongoose = require('mongoose');
if(nconf.get("mongodb:security")){
    mongoose.connect(nconf.get('mongodb:uri'), mongooseOptionConnect);
}else{
    mongoose.connect(nconf.get('mongodb:uri'));
}

module.exports = {
    models: {
        Student: require('./Schemas/student').Student,
        StudentCourses: require('./Schemas/student').StudentCourses,
        Category: require('./Schemas/category').Category,
        Course: require('./Schemas/course').Course,
        CourseMaterial: require('./Schemas/course').CourseMaterial,
        Payment: require('./Schemas/payment').Payment,
        Coach: require('./Schemas/coach').Coach,
        Admin: require('./Schemas/admin').Admin,
        AppLog: require('./Schemas/log').AppLog
    },
    types:{
        StudentStatus: require('./Schemas/student').Status,
        CourseStatus: require('./Schemas/course').CourseStatus,
        Currency: require('./Schemas/course').Currency,
        PaymentStatus: require('./Schemas/payment').PaymentStatus
    }
}