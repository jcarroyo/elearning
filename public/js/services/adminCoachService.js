angular.module('learningService')
.service('AdminCoachService', function($http, $q){
        var getCoaches = function(){
                var d = $q.defer();
                $http({
                    method: 'GET',
                    url: '/api-admin/coach'
                }).success(function(data, status, header){
                    d.resolve(data);
                }).error(function(data, status, header){
                    d.reject(data);
                });
                return d.promise;
            },
            saveCoach = function(coach){
                var d = $q.defer();
                $http({
                    method: 'POST',
                    url: '/api-admin/coach',
                    data: coach
                }).success(function(data, status, header){
                    d.resolve(data);
                }).error(function(data, status, header){
                    d.reject(data);
                });
                return d.promise;
            },
            updateCoach = function(coach){
                var d = $q.defer();
                $http({
                    method: 'PUT',
                    url: '/api-admin/coach',
                    data: coach
                }).success(function(data, status, header){
                    d.resolve(data);
                }).error(function(data, status, header){
                    d.reject(data);
                });
                return d.promise;
            },
            getCoachByID = function(id){
                var url = '/api-admin/coach/{0}'.format(id);
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
            getCoachesLookUp = function(){
                var d = $q.defer();
                $http({
                    method: 'GET',
                    url: '/api-admin/lookup/coaches'
                }).success(function(data, status, header){
                    d.resolve(data);
                }).error(function(data, status, header){
                    d.reject(data);
                });
                return d.promise;
            },
            removeCoach = function(coachID){
                var url = '/api-admin/coach/{0}'.format(coachID);
                var d = $q.defer();
                $http({
                    method: 'DELETE',
                    url: url
                }).success(function(data, status, header){
                    d.resolve(data);
                }).error(function(data, status, header){
                    d.reject(data);
                })
                return d.promise;
            };

        return {
            getCoaches: getCoaches,
            saveCoach: saveCoach,
            updateCoach: updateCoach,
            getCoachByID: getCoachByID,
            getCoachesLookUp: getCoachesLookUp,
            removeCoach: removeCoach
        }
    });