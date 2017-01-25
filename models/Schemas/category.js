var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var schema = new Schema({
    _id: {type: Number},
    name: {type: String}
}, {strict: false});

module.exports = {
    Category: mongoose.model('Category', schema, 'category')
};