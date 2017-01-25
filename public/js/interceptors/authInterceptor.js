angular.module('learningApp')

.factory('httpInterceptor', function ($rootScope, $q, $window, UserManager) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.localStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
            }
            return config;
        },
        response: function (response) {
            if(response.data.hasOwnProperty("status")){
                if(!response.data.status){
                    alert(response.data.emsg);
                }
                response.data = response.data.result;
            }
            return response || $q.when(response);
        },
        responseError: function(response){
            if(response.status == 401){
                return UserManager.logOut();
            }
            alert(response.data.emsg);
        }
    };
})

.config(function ($httpProvider) {
    $httpProvider.interceptors.push('httpInterceptor');
});