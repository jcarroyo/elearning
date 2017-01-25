var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var lessonSchema = new Schema({
    title: {type: String},
    order: {type: Number},
    videoDuration: {type: Number},
    externalID: {type: String},
    embedCode: {type: String}
});

var sectionSchema = new Schema({
    title: {type: String},
    order: {type: Number},
    lessons: [lessonSchema]
});

var courseSchema = new Schema({
    title: {type: String},
    friendlyUrlName: {type: String},
    category: {type: String},
    description: {type: String},
    shortDescription: {type: String},
    tags: {type: Array},
    price: {type: Number},
    currency: {type: String},
    sections: [sectionSchema],
    creationDate: {type: Date},
    modificationDate: {type: Date},
    status: {type: String},
    fakeCounter: {type: Number},
    coachID: {type: ObjectId},
    images: {
        largeImage: {
            id: {type: String},
            url: {type: String}
        },
        smallImage: {
            id: {type: String},
            url: {type: String}
        }
    }
}, {strict: false});

var courseMaterialSchema = new Schema({
    courseID: {type: ObjectId},
    lessonID: {type: ObjectId},
    name: {type: String},
    description: {type: String},
    fileName: {type: String}
});

var courseStatus = {
    draft: 'draft',
    published: 'published'
}

var currency = {
    soles: "S/.",
    dolares: "$"
}

module.exports = {
    Course: mongoose.model('Course', courseSchema, 'course'),
    CourseMaterial: mongoose.model('CourseMaterial', courseMaterialSchema, 'courseMaterial'),
    CourseStatus: courseStatus,
    Currency: currency
};