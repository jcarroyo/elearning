angular.module('learningService')
.service('AdminCoursesService', function($http, $q){
    var getCourses = function(category){
        var d = $q.defer();
        $http({
            method: 'GET',
            url: '/api-admin/course',
            params: {
                category: category
            }
        }).success(function(data, status, header){
            d.resolve(data);
        }).error(function(data, status, header){
            d.reject(data);
        });
        return d.promise;
    };
    var getCourseCategories = function(){
        var d = $q.defer();
        $http({
            method: 'GET',
            url: '/api-admin/categories'
        }).success(function(data, status, header){
            d.resolve(data);
        }).error(function(data, status, header){
            d.reject(data);
        });
        return d.promise;
    };
    var createCourseDescription = function(course){
        var d = $q.defer();
        $http({
            method: 'POST',
            data: course,
            url: '/api-admin/course'
        }).success(function(data, status, header){
            d.resolve(data);
        }).error(function(data, status, header){
            d.reject(data);
        });
        return d.promise;
    };

    var updateCourseDescription = function(courseID, course){
        var url = '/api-admin/course/{0}'.format(courseID);
        var d = $q.defer();
        $http({
            method: 'PUT',
            data: course,
            url: url
        }).success(function(data, status, header){
            d.resolve(data);
        }).error(function(data, status, header){
            d.reject(data);
        });
        return d.promise;
    };

    var addCourseContentSection = function(courseID, section){
        var url = '/api-admin/course/{0}/course-content/section'.format(courseID);
        var d = $q.defer();
        $http({
            method: 'POST',
            data: section,
            url: url,
            params: {
                courseID: courseID
            }
        }).success(function(data, status, header){
            d.resolve(data);
        }).error(function(data, status, header){
            d.reject(data);
        });
        return d.promise;
    };

    var addCourseContentLesson = function(courseID, sectionID, lesson){
        var url = '/api-admin/course/{0}/course-content/section/{1}/lesson'.format(courseID, sectionID);
        var d = $q.defer();
        $http({
            method: 'POST',
            data: lesson,
            url: url
        }).success(function(data, status, header){
            d.resolve(data);
        }).error(function(data, status, header){
            d.reject(data);
        });
        return d.promise;
    };

    var getUploadVideoToken = function(courseID, sectionID ,lessonID){
        var d = $q.defer();
        $http({
            method: 'GET',
            url: '/api-admin/video/generateUploadToken',
            params: {
                courseID: courseID,
                sectionID: sectionID,
                lessonID: lessonID
            }
        }).success(function(data, status, header){
            d.resolve(data);
        }).error(function(data, status, header){
            d.reject(data);
        });
        return d.promise;
    };

    var getCourseContentInfoByID = function(courseID){
        var url = '/api-admin/course/{0}/contentInfo'.format(courseID);
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
    };

    var getCurrencyList = function(){
        var d = $q.defer();
        $http({
            method: 'GET',
            url: '/api-admin/currency'
        }).success(function(data, status, header){
            d.resolve(data);
        }).error(function(data, status, header){
            d.reject(data);
        });
        return d.promise;
    };

    var removeCourseContentLesson = function(courseID, sectionID, lessonID){
        var url = '/api-admin/course/{0}/course-content/section/{1}/lesson/{2}'.format(courseID, sectionID, lessonID);
        var d = $q.defer();
        $http({
            method: 'DELETE',
            url: url
        }).success(function(data, status, header){
            d.resolve(data);
        }).error(function(data, status, header){
            d.reject(data);
        });
        return d.promise;
    };

    var changeCourseStatus = function(courseID, newStatus){
        var url = '/api-admin/course/{0}/status'.format(courseID);
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: url,
            data: {
                status: newStatus
            }
        }).success(function(data, status, header){
            d.resolve(data);
        }).error(function(data, status, header){
            d.reject(data);
        });
        return d.promise;
    };

    var getCourseByID = function(courseID){
        var url = "/api-admin/course/{0}".format(courseID);
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
    };

    var getCourseDescriptionByID = function(courseID){
        var url = "/api-admin/course/{0}/description".format(courseID);
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
    };

    return {
        getCourses: getCourses,
        createCourseDescription: createCourseDescription,
        getCourseCategories: getCourseCategories,
        addCourseContentSection: addCourseContentSection,
        addCourseContentLesson: addCourseContentLesson,
        getUploadVideoToken: getUploadVideoToken,
        getCourseContentInfoByID: getCourseContentInfoByID,
        getCurrencyList: getCurrencyList,
        removeCourseContentLesson: removeCourseContentLesson,
        changeCourseStatus: changeCourseStatus,
        getCourseByID: getCourseByID,
        updateCourseDescription: updateCourseDescription,
        getCourseDescriptionByID: getCourseDescriptionByID
    };

});