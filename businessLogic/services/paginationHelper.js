var Q = require('q'),
    nconf = require('nconf'),
    async = require('async')
function paginateFilter(page){
    var pageSize = nconf.get("paging:pageSize"),
        pagination = {
            skip: pageSize * (page-1),
            limit: pageSize
        };
    return pagination;
}

function paginate(currentPage, count, data){
    var pageSize = nconf.get("paging:pageSize");
    if(!pageSize){
        pageSize = 1;
    }
    return {
        currentPage: currentPage,
        data: data,
        count: count,
        pages: Math.ceil(count / pageSize)
    };
}

/***
 *
 * @param model Mongoose model
 * @param {Object} filter
 * @param {Object} fields
 * @param {int} page
 * @returns {d.promise|Function}
 */
//todo: add sort
function paginateQuery(model, filter, fields, page){
    var d = Q.defer();

    //validate page input field
    if(isNaN(page)){
        page = 1;
    }
    if(page > nconf.get("paging:maxPage")){
        page = 1;
    }
    page = Number(page);

    var pagination = paginateFilter(page);
    async.parallel({
            count: function(callback){
                model.where(filter).count(function(error, count){
                    return callback(error, count);
                });
            },
            data: function(callback){
                model.find(filter, fields, pagination, function(error, result){
                    return callback(error, result);
                });
            }
        },
        function(error, results) {
            if (error) {
                return d.reject(error);
            }
            return d.resolve(paginate(page, results.count, results.data));
        }
    );
    return d.promise;
}

module.exports = paginateQuery;