var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var coachSchema = new Schema({
    name: {type: String},
    creationDate: {type: Date},
    bio: {type: String},
    image: {
        id: {type: String},
        url: {type: String}
    }
}, {strict: false});

module.exports = {
    Coach: mongoose.model('Coach', coachSchema, 'coach')
};