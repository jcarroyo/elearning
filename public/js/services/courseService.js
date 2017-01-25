angular.module('learningService')
    .service('CourseService', function($http, $q){
        var getCourseByFriendlyName = function(friendlyUrlName){
            var url = '/api/course/{0}'.format(friendlyUrlName);
            var d = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header){
                d.resolve(data);
            }).error(function(data, status, header){
                d.reject(data);
            });
            return d.promise;
        },
        buyCourse = function(courseID){
            var url = '/api/course/{0}/buy'.format(courseID);
            var d = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header){
                d.resolve(data);
            }).error(function(data, status, header){
                d.reject(data);
            });
            return d.promise;
        },
        getCourseLessonsByFriendlyUrlName = function(friendlyUrlName){
            var url = '/api/course/{0}/lessons'.format(friendlyUrlName);
            var d = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header){
                d.resolve(data);
            }).error(function(data, status, header){
                d.reject(data);
            });
            return d.promise;
        }
        return {
            getCourseByFriendlyName: getCourseByFriendlyName,
            getCourseLessonsByFriendlyUrlName: getCourseLessonsByFriendlyUrlName,
            buyCourse: buyCourse
        }
});