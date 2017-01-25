angular.module('userModule', [])

.service('UserManager', function($window){
    var isUserLogged = function(){
            var token = getUserToken();
            return (token != null && token != undefined)? true: false;
        },
        saveUserToken = function(token){
            $window.localStorage.token = token;
        },
        getUserToken = function(){
            return $window.localStorage.token;
        },
        saveUserInfo = function(userInfo){
            if(userInfo) {
                $window.localStorage.userInfo = JSON.stringify(userInfo);
            }
        },
        getUserInfo = function(){
            var userInfo = $window.localStorage.userInfo;
            if(userInfo){
                return JSON.parse(userInfo);
            }
            return null;
        },
        logOut = function(){
            $window.localStorage.removeItem('token');
            $window.localStorage.removeItem('userInfo');
            $window.location.href = '/';
        }

    return {
        isUserLogged: isUserLogged,
        saveUserToken: saveUserToken,
        getUserToken: getUserToken,
        logOut: logOut,
        saveUserInfo: saveUserInfo,
        getUserInfo: getUserInfo
    }
});