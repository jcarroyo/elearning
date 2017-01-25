var Q = require('q'),
    models = require('../../models').models,
    types = require('../../models').types,
    SproutVideo = require('../../sproutvideo'),
    async = require('async'),
    CoachService = require('./coach'),
    fs = require('fs'),
    //https://cloudinary.com/console
    cloudinary = require('cloudinary');

//prefix adm to only admin actions
//prefix usr to user actions

var admGetCourses = function(category){
    var filter = {};
    if(category){
        filter['category'] = category;
    }
    return models.Course.find(filter).exec();
}

var admCreateCourseDescription = function(course){
    var tags = course.tags ? course.tags.split(",") : [];
    if(tags.length){
        tags.forEach(function(item, index, array){
           array[index] = item.trim();
        });
    }
    var Course = new models.Course({
        title: course.title,
        friendlyUrlName: course.friendlyUrlName,
        category: course.category,
        description: course.description,
        shortDescription: course.shortDescription,
        tags: tags,
        currency: course.currency,
        price: course.price,
        creationDate: (new Date).getTime(),
        fakeCounter: course.fakeCounter,
        status: types.CourseStatus.draft,
        sections: [],
        coachID: course.coachID
    });
    return Course.save();
}

var admUpdateCourseDescription = function(courseID, course){
    var tags = [];
    if(course.tags){
        if(typeof(course.tags) == "string"){
            course.tags = course.tags.split(",");
        }
        course.tags.forEach(function (item, index, array) {
            array[index] = item.trim();
        });
        tags = course.tags;
    }
    var d = Q.defer();
    var query = {
        _id: courseID
        },
        update = {
            title: course.title,
            friendlyUrlName: course.friendlyUrlName,
            category: course.category,
            description: course.description,
            shortDescription: course.shortDescription,
            tags: tags,
            currency: course.currency,
            price: course.price,
            modificationDate: (new Date).getTime(),
            fakeCounter: course.fakeCounter,
            coachID: course.coachID
        };
    models.Course.update(query, update, function(error, result){
        if(error){
            d.reject(error);
        }else{
            d.resolve(result);
        }
    });
    return d.promise;
}

var admGetCourseContentInfoByID = function(courseID){
    return models.Course.findById(courseID, {_id: true, title: true, sections: true}).exec();
}

var getCourseInformationForPayment = function(courseID){
    var fields = {
        title: true,
        shortDescription: true,
        currency: true,
        price: true
    };
    return models.Course.findById(courseID, fields).exec();
}

var getCourseByFriendlyUrlName = function(friendlyUrlName, studentID){
    var fields = {
        title: true,
        category: true,
        description: true,
        shortDescription: true,
        price: true,
        currency: true,
        "sections.title": true,
        "sections.lessons.title": true,
        "sections.lesson.videoDuration": true,
        "sections.lessons._id": true,
        coachID: true,
        images: true
    };
    var d = Q.defer();
    models.Course.findOne({friendlyUrlName: friendlyUrlName}, fields, function(error, course){
        if(error){
            return d.reject(error);
        }
        if(course == null){
            return d.resolve(null);
        }

        course.set('payed', false);

        async.parallel([
            function(callback){

                if(studentID == null){
                    return callback(null, course);
                }

                models.StudentCourses.findOne({studentID: studentID, courseID: course.id}, function(error, studentCourse){
                    if(error){
                        return callback(error);
                    }
                    if(studentCourse != null){
                        course.set('payed', true);
                    }
                    return callback(null, course);
                });
            },
            function(callback){
                if(course.coachID) {
                    CoachService.getCoachByID(course.coachID).then(
                        function(coach){
                            return callback(error, coach);
                        },
                        function(error){
                            return callback(error);
                        }
                    );
                }else{
                    callback(null);
                }
            }
        ], function(error, result){
            if(error){
                d.reject(error);
            }else{
                d.resolve({
                    course: result[0],
                    coach: result[1]
                });
            }
        });
    });
    return d.promise;
}

var admCourseAddSection = function(courseID, section){
    var d = Q.defer();
    models.Course.findById(courseID).exec()
    .then(function(course){
        if(course != null){
            course.sections.push({
                title: section.title,
                order: section.order,
                lessons: []
            });

            course.save().then(function(c){
                d.resolve(c._id);
            },function(error){
                d.reject(error);
            });

        }else{
            d.reject("Course doesn't exists");
        }
    },function(error){
        d.reject(error);
    });

    return d.promise;
}

var admCourseAddLessonToSection = function(courseID, sectionID, lesson){
    var d = Q.defer();
    models.Course.findById(courseID, function(error, course){
       if(error){
           d.reject(error);
       }else{
           if(course){
               var section = course.sections.id(sectionID);
               if(section != null) {
                   section.lessons.push({
                       title: lesson.title,
                       order: lesson.order
                   });
                   course.save().then(function (c) {
                       var lessonID = 0;
                       c.sections.forEach(function (section) {
                           if (section._id == sectionID) {
                               section.lessons.forEach(function (l) {
                                   if (l.title == lesson.title && l.order == lesson.order) {
                                       lessonID = l._id;
                                   }
                               });
                           }
                       });
                       d.resolve(lessonID);
                   }, function (err) {
                       d.reject(err);
                   });
               }else{
                   d.reject("The section doesn't exists");
               }
           }else{
               d.reject("Course doesn't exists");
           }
       }
    });
    return d.promise;
}

var admGetCurrencyList = function(){
    return types.Currency;
}

var admRemoveCourseLesson = function(courseID, sectionID, lessonID){
    var d = Q.defer(),
        promiseGetCourse,
        promiseHostingServer,
        updCourse,
        videoID;

    function remove(){
        async.parallel([
            //remove from local db
            function(callback){
                updCourse.save().then(function(c){
                    return callback(null);
                },function(error){
                    return callback(error);
                });
            },
            //remove from remove video hosting server
            function(callback){
                SproutVideo.removeVideo(videoID).then(function(result){
                    return callback(null);
                },function(error){
                   return callback(error);
                });
            }
        ],function(error){
            console.log(error);
            if(error){
                d.reject(error)
            }else{
                d.resolve(true);
            }
        })
    }

//1. Get the course
    var promiseGetCourse = models.Course.findById(courseID).exec();
    promiseGetCourse.then(function(course){
        if(course){
            //find the lesson
            var lesson = course.sections.id(sectionID).lessons.id(lessonID);
            videoID = lesson.externalID;
            lesson.remove();
            updCourse = course;
            //2. Remove from video hosting server and update Local Course
            remove();
        }else{
            d.reject("Course doesn't exists");
        }
    },function(error){
        d.reject(error);
    });

    return d.promise;
}

var admUpdateCourseStatus = function(courseID, status){
    var d = Q.defer();
    models.Course.update({_id: courseID}, {$set: {status: status}}, function(error){
       if(error){
           d.reject(error);
       }else{
           d.resolve(true);
       }
    });
    return d.promise;
}

var admUpdateLessonVideoInformation = function(courseID, sectionID, lessonID, videoID){
    var d = Q.defer();
    SproutVideo.getVideo(videoID).then(
        function(video){
            console.log(video);
            models.Course.findById(courseID, function(findCourseError, course){
                if(findCourseError){
                    d.reject(findCourseError);
                }else{
                    if(course.length == 0){
                        d.reject("The course doesn't exists");
                    }else{
                        var lesson = course.sections.id(sectionID).lessons.id(lessonID);
                        lesson.videoDuration = video.duration;
                        lesson.externalID = video.id;
                        lesson.embedCode = video.embed_code;
                        course.save(function(SaveError){
                            if(SaveError){
                                d.reject(SaveError);
                            }else{
                                d.resolve(true);
                            }
                        });
                    }
                }
            });
        },
        function(videoError){
            d.reject(videoError);
        }
    );
    return d.promise;
}

var admUpdateCourseImages = function(courseID, images){
    var d = Q.defer();
    var largeImage = null, smallImage = null;

    async.forEachOf(images, function(value, key, callback){
        console.log(key);
        var img = null;
        if(value){
            img = value[0];
        }
        var filePath = img.path;
        cloudinary.uploader.upload(filePath, function(result) {
            console.log(result);
            var id = result.public_id;
            var url = result.url;
            if(key == 'largeImage'){
                largeImage = {
                    id: id,
                    url: url
                }
            }
            if(key == 'smallImage'){
                smallImage = {
                    id: id,
                    url: url
                }
            }
            return callback(null);
        });
    }, function(error){
        if(error){
            d.reject(error);
        }else{
            var updateFields = {
                $set: {
                    images: {
                        largeImage: largeImage,
                        smallImage: smallImage
                    }
                }
            };
            models.Course.update({_id: courseID}, updateFields, function(error){
               if(error){
                   d.reject(error);
               }else{
                   d.resolve(true);
               }
            });
        }
    });
    return d.promise;
}

/*console.log(req.file);
 var filePath = 'tmpUploads/' + req.file.filename;
 cloudinary.uploader.upload(filePath, function(result) {
 fs.unlink(filePath, function(error){
 console.log(result)
 res.redirect('/admin/course-images');
 });
 });*/

var admGetCourseDescriptionByID = function(courseID){
    var excludeFields = {
        images: false,
        sections: false,
        modificationDate: false
    }
    return models.Course.findOne(courseID, excludeFields).exec();
}

var admGetCourseByID = function(courseID){
    return models.Course.findOne(courseID).exec();
}

var getCourseLessonsByFriendlyUrlName = function(friendlyUrlName, studentID){
    var d = Q.defer();
    var fields = {
        "_id": true,
        "sections.title": true,
        "sections.order": true,
        "sections.lessons._id": true,
        "sections.lessons.title": true,
        "sections.lessons.order": true,
        "sections.lessons.videoDuration": true,
        "sections.lessons.embedCode": true,
    }
    models.Course.findOne({friendlyUrlName: friendlyUrlName}, fields, function(error, course){
       if(error) {
           return d.reject(error);
       }
       if(course){
            models.StudentCourses.findOne({studentID: studentID, courseID: course._id}, function(error, studentCourse){
                if(error){
                    return d.reject(error);
                }
                if(studentCourse){
                    return d.resolve(course);
                }else{
                    return d.resolve(null);
                }
           }
        );
       }else{
           return d.resolve(null);
       }
    });
    return d.promise;
}

var admGetCourseLessonsLookup = function(courseID){
    var fields = {
        sections: true
    }
    return models.Course.find({_id: courseID}, fields).exec();
}

var getMaterial = function(materialID){
    var fields = {
        fileName: true
    }
    return models.CourseMaterial.findOne({_id: materialID}, fields).exec();
}

var admGetLessonMaterial = function(materialID){
    var fields = {
        name: true,
        description: true,
        fileName: true
    }
    return models.CourseMaterial.findOne({_id: materialID}, fields).exec();
}

module.exports = {
    //user
    getCourseByFriendlyUrlName: getCourseByFriendlyUrlName,
    getCourseInformationForPayment: getCourseInformationForPayment,
    getCourseLessonsByFriendlyUrlName: getCourseLessonsByFriendlyUrlName,
    getMaterial: getMaterial,
    //adm
    admCourseAddSection: admCourseAddSection,
    admCourseAddLessonToSection: admCourseAddLessonToSection,
    admCreateCourseDescription: admCreateCourseDescription,
    admGetCourses: admGetCourses,
    admGetCourseContentInfoByID: admGetCourseContentInfoByID,
    admGetCurrencyList: admGetCurrencyList,
    admRemoveCourseLesson: admRemoveCourseLesson,
    admUpdateCourseStatus: admUpdateCourseStatus,
    admUpdateLessonVideoInformation: admUpdateLessonVideoInformation,
    admUpdateCourseImages: admUpdateCourseImages,
    admGetCourseByID: admGetCourseByID,
    admUpdateCourseDescription: admUpdateCourseDescription,
    admGetCourseDescriptionByID: admGetCourseDescriptionByID,
    admGetCourseLessonsLookup: admGetCourseLessonsLookup,
    admGetLessonMaterial: admGetLessonMaterial
}