var Q = require('q'),
    models = require('../../models').models,
    types = require('../../models').types,
    async = require('async'),
    paginationHelper = require('./paginationHelper');

var getCategories = function(){
    var d = Q.defer();
    models.Category.find(function(error, result){
        if(error){
            return d.reject(error);
        }
        d.resolve({
            data: result,
            count: result.length
        });
    });
    return d.promise;
};

var getCourses = function(category, page){
    var d = Q.defer();
    var filter = {
        status: types.CourseStatus.published
    };
    if(category){
        filter.category = category
    }
    var fields = {
        _id: true,
        title: true,
        friendlyUrlName: true,
        shortDescription: true,
        price: true,
        currency: true,
        images: true
    };
    return paginationHelper(models.Course, filter, fields, page);
};

//todo: add a order by clause
var getCourseByTermSearch = function(termSearch, page){
    var regTerm = new RegExp("\\s*" + termSearch, 'i');
    var filter = {
        $or: [
            {
                title: regTerm
            },
            {
                tags: {
                    $in: [
                        regTerm
                    ]
                }
            }
        ]
    }
    var fields = {
        _id: true,
        title: true,
        friendlyUrlName: true,
        shortDescription: true,
        price: true,
        currency: true,
        images: true
    }
    return paginationHelper(models.Course, filter, fields, page);
}

module.exports = {
    getCategories: getCategories,
    getCourses: getCourses,
    getCourseByTermSearch: getCourseByTermSearch
}