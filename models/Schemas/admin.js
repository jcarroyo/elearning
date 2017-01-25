var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var AdminSchema = new Schema({
    name: {type: String},
    login: {type: String},
    email: {type: String},
    password: {type: String},
    lastLogin: {type: Date}
});

module.exports = {
    Admin: mongoose.model('Admin', AdminSchema)
};