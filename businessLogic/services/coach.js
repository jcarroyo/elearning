var Q = require('q'),
    models = require('../../models').models,
    types = require('../../models').types,
    async = require('async'),
    cloudinary = require('cloudinary'),
    queueTasks = require('../../libs/queueTasks');

var getCoaches = function(){
    return models.Coach.find().exec();
}

var saveCoach = function(coach){
    var d = Q.defer();
    var coachModel = new models.Coach({
        name: coach.name,
        bio: coach.bio
    });
    coachModel.save(function(error, result){
       if(error){
           d.reject(error);
       }else{
           d.resolve(result);
       }
    });
    return d.promise;
}

var updateCoach = function(coach){
    var d = Q.defer();
    models.Coach.update({_id: coach._id}, coach, function(error){
       if(error){
           d.reject(error);
       }else{
           d.resolve(true);
       }
    });
    return d.promise;
}

var getCoachByID = function(id){
    return models.Coach.findById(id);
}

var getCoachesLookUp = function(){
    var fields = {
        _id: true,
        name: true
    };
    return models.Coach.find({},fields).exec();
}


var admCoachUpdateImages = function(coachID, images){
    var d = Q.defer();

    async.waterfall([
        function(callback){

            if(!images || !images.coachImage){
                return d.reject("Please provide an image")
            }

            var image = images.coachImage[0];
            var filePath = image.path;
            cloudinary.uploader.upload(filePath, function(result){
                var id = result.public_id;
                var url = result.url;
                return callback(null, {id: id, url: url});
            })
        },
        function(uploadImage, callback){
            models.Coach.update({_id: coachID}, {$set: {'image.id': uploadImage.id, 'image.url': uploadImage.url}}, function(err){
                return callback(err);
            })
        }
    ],function(error){
        if(error){
            return d.reject(error);
        }
        return d.resolve(true);
    })

    return d.promise;
}

var admRemoveCoach = function(coachID){
    var d = Q.defer();
    var coach = getCoachByID(coachID).then(
        function(coach){
            if(coach){
                if(coach.image){
                    var imageID = coach.image.id;
                    var task = function(){
                        var d = Q.defer();
                        cloudinary.uploader.destroy(imageID, function(result){
                            d.resolve(result);
                        })
                        return d.promise;
                    }
                    queueTasks.push(task);
                }
                models.Coach.remove({_id: coachID}, function(error){
                    if(error){
                        return d.reject(error);
                    }
                    return d.resolve(true);
                });
            }else{
                return d.resolve(false);
            }
        },
        function(error){
            return d.reject(error);
        }
    )
    return d.promise;
}


module.exports = {
    getCoaches: getCoaches,
    saveCoach: saveCoach,
    updateCoach: updateCoach,
    getCoachByID: getCoachByID,
    getCoachesLookUp: getCoachesLookUp,
    admCoachUpdateImages: admCoachUpdateImages,
    admRemoveCoach: admRemoveCoach
}