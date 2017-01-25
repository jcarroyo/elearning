var express = require('express'),
    router = express.Router(),
    CatalogService = require('../../businessLogic').CatalogService,
    cache = new(require("node-cache")),
    mLogger = require('../../libs/logger');

router.get('/categories', function(req, res, next) {
    cache.get('categoryList', function(err, cacheValue) {
        if (!err) {
            if (cacheValue === undefined) {
                CatalogService.getCategories().then(
                    function(data) {
                        cache.set('categoryList', data);
                        return res.msend(1, data);
                    },
                    function(error) {
                        mLogger.error(mLogger.module.student, "Cannot retrieve categories from db", {
                            error: error.toString()
                        });
                        return res.msend(-1);
                    }
                );
            } else {
                return res.msend(1, cacheValue);
            }
        } else {
            mLogger.error(mLogger.module.student, "Cannot retrieve categories from cache", {
                error: error.toString()
            });
            return res.msend(-1);
        }
    });
});

router.get('/courses', function(req, res, next) {
    //pagination: skip, pageSize
    //category
    var category = req.query.category == undefined ? null : req.query.category,
        page = req.query.page;

    CatalogService.getCourses(category, page).then(
        function(data) {
            return res.msend(1, data);
        },
        function(error) {
            mLogger.error(mLogger.module.student, "Cannot retrieve courses", {
                error: error.toString()
            });
            return res.msend(-1);
        }
    );
});

router.get('/course/search', function(req, res, next) {
    var termSearch = req.query.q,
        page = req.query.page;

    CatalogService.getCourseByTermSearch(termSearch, page).then(
        function(result) {
            mLogger.info(mLogger.module.student, "Query catalog with term", {
                term: termSearch,
                count: result.length
            });
            return res.msend(1, result);
        },
        function(error) {
            mLogger.error(mLogger.module.student, "Query catalog with term", {
                term: termSearch,
                error: error.toString()
            })
            return res.msend(-1)
        }
    )
})

module.exports = router;