angular.module('learningService')
    .service('AdminStudentService', function($http, $q){
        var getStudentList = function(page, pageSize){
            var d = $q.defer();
            $http({
                method: 'GET',
                url: '/api-admin/student',
                params: {
                    $page: page,
                    $pageSize: pageSize
                }
            }).success(function(data, status, header){
                d.resolve(data);
            }).error(function(data, status, header){
                d.reject(data);
            });
            return d.promise;
        }
        return {
            getStudentList: getStudentList
        }
    });