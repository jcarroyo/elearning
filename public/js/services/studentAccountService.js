angular.module('learningService')
.service('StudentAccountService', function($http, $q){
    var createAccount = function(newAccount){
        var d = $q.defer();
        $http({
            method: 'POST',
            data: newAccount,
            url: '/api/account/student/signup'
        }).success(function(data, status, header){
            d.resolve(data);
        }).error(function(data, status, header){
            d.reject(data);
        });
        return d.promise;
    };
    var login = function(login){
        var d = $q.defer();
        $http({
            method: 'POST',
            data: login,
            url: '/api/account/student/login'
        }).success(function(data, status, header){
            d.resolve(data);
        }).error(function(data, status, header){
            d.reject(data);
        });
        return d.promise;
    };
    var getStudentProfile = function(){
        var d = $q.defer();
        $http({
            method: 'GET',
            url: '/api/account/student/profile'
        }).success(function(data, status, header){
            d.resolve(data);
        }).error(function(data,status, header){
            d.reject(data);
        })
        return d.promise;
    };
    var getStudentCourses = function(){
        var d = $q.defer();
        $http({
            method: 'GET',
            url: '/api/account/student/courses'
        }).success(function(data, status, header){
            d.resolve(data);
        }).error(function(data, status, header){
            d.reject(data);
        })
        return d.promise;
    };
    var changeStudentPassword = function(currentPassword, newPassword){
        var d = $q.defer();
        $http({
            method: 'POST',
            data: {
                currentPassword: currentPassword,
                newPassword: newPassword
            },
            url: '/api/account/student/changePassword'
        }).success(function(data, status, header){
            d.resolve(data);
        }).error(function(data, status, header){
            d.reject(data);
        });
        return d.promise;
    };
    var updateStudentProfile = function(newProfile){
        var d = $q.defer();
        $http({
            method: 'POST',
            data: newProfile,
            url: '/api/account/student/profile'
        }).success(function(data, status, header){
            d.resolve(data);
        }).error(function(data, status, header){
            d.reject(data);
        });
        return d.promise;
    };
    return {
        createAccount: createAccount,
        login: login,
        getStudentProfile: getStudentProfile,
        getStudentCourses: getStudentCourses,
        changeStudentPassword: changeStudentPassword,
        updateStudentProfile: updateStudentProfile
    }
});