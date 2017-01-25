var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var schema = new Schema({
    studentID: {type: ObjectId},
    createdDate: {type: Date},
    courseID: {type: ObjectId},
    payID: {type: String},
    status: {type: Number}
});

var status = {
    pending: 0,
    payed: 1,
    cancel: -1
}

module.exports = {
    Payment: mongoose.model('Payment', schema),
    PaymentStatus: status
};