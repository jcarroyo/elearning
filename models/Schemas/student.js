var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var StudentSchema = new Schema({
    id: {type: ObjectId},
    name: {type: String},
    email: {type: String},
    password: {type: String},
    gender: {type: String},
    age: {type: Number},
    birthDay: {type: Date},
    createdDate: {type: Date},
    status: {type: Number},
    lastLogin: {type: Date},
    activationCode: {type: String}
});

var StudentCoursesSchema = new Schema({
    studentID: {type: ObjectId},
    courseID: {type: ObjectId},
    enrolledDate: {type: Date}
});

var status = {
    active: 1,
    lock: 2,
    pendingToActivate: 3 //pending to activate
}

module.exports = {
    Student: mongoose.model('Student', StudentSchema),
    StudentCourses: mongoose.model('StudentCourses', StudentCoursesSchema),
    Status: status
};