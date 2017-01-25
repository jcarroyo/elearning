var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var logSchema = new Schema({
    _id: {type: ObjectId},
    message: {type: String},
    timestamp:{type: Date},
    level: {type: String},
    meta: {type: Schema.Types.Mixed}
});

module.exports = {
    AppLog: mongoose.model('AppLog', logSchema, 'appLog')
};