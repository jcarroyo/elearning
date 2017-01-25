angular.module('learningService')
    .service('CatalogService', function($http, $q){
        var getCategories = function(){
            var d = $q.defer();
            $http({
                method: 'GET',
                url: '/api/catalog/categories'
            }).success(function(data, status, header){
                d.resolve(data);
            }).error(function(data, status, header){
                d.reject(data);
            });
            return d.promise;
        };
        var getCourses = function(category, skip, top){
            var d = $q.defer();
            $http({
                method: 'GET',
                url: '/api/catalog/courses',
                params: {
                    category: category,
                    $skip: skip,
                    $top: top
                }
            }).success(function(data, statusm, header){
                d.resolve(data);
            }).error(function(data, status, header){
                d.reject(data);
            });
            return d.promise;
        };
        var getPromoCourses = function(){
            var d = $q.defer();
            $http({
                method: 'GET',
                url: '/api/catalog/promos'
            });
            return d.promise;
        }
        return {
            getCategories: getCategories,
            getCourses: getCourses,
            getPromoCourses: getPromoCourses
        }
    });