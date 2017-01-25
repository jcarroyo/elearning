var Q = require('q'),
    models = require('../../models').models,
    types = require('../../models').types,
    async = require('async'),
    nconf = require('nconf');

var admGetStudentList = function(page, pageSize){
    var d = Q.defer();
    var studentFields = {
        id: true,
        name: true,
        createdDate: true,
        status: true,
        lastLogin: true
    };

    page = (page == null || page == undefined)? 1 : page;
    pageSize = (pageSize == null || pageSize == undefined)? nconf.get("paging:pageSize") : pageSize;
    var skip = (page - 1) * pageSize;

    async.parallel([
        function(callback){
            models.Student.count(function(error, count){
               return callback(error, count);
            });
        },
        function(callback){
            models.Student.find({},studentFields, {skip: skip, limit: pageSize}, function(error, students){
               return callback(error, students);
            });
        }
    ], function(error, results){
        if(error){
            d.reject(error);
            return;
        }
        d.resolve({
            count: results[0],
            pages: Math.ceil(results[0] / pageSize),
            students: results[1]
        })
    });
    return d.promise;
}

module.exports = {
    admGetStudentList: admGetStudentList
}