angular.module('learningService')
    .service('AdminLogService', function($http, $q){
            getLogs = function(level, page){
                var url = '/api-admin/support/logs?level={0}&page={1}'.format(level, page);
                var d = $q.defer();
                $http({
                    method: 'GET',
                    url: url
                }).success(function(data, status, header){
                    d.resolve(data);
                }).error(function(data, status, header){
                    d.reject(data);
                })
                return d.promise;
            };

        return {
            getLogs: getLogs
        }
    });