angular.module('learningController')
    .controller('StudentLoginController', function($scope, StudentAccountService, UserManager, $window, Notification){
        $scope.account = {};
        $scope.pressKey = function(e){
            if(e.keyCode == 13){
                $scope.login();
            }
        }
        $scope.login = function(){
            StudentAccountService.login($scope.account).then(
                function(result){
                    UserManager.saveUserToken(result.token);
                    UserManager.saveUserInfo(result.userInfo);

                    var return_url = getUrlParameterByName("return_url");
                    if(return_url){
                        $window.location.href = return_url;
                    }else {
                        $window.location.href = "/catalog";
                    }
                }
            );
        }
    });