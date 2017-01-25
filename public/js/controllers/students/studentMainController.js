angular.module('learningController')
    .controller('StudentMainController', function($scope, UserManager, $window, Notification){
        $scope.isUserLogged = function(){
            return UserManager.isUserLogged();
        }
        $scope.logOut = function(){
            UserManager.logOut();
            $window.location.href = "/";
        }
        $scope.getStudentName = function(){
            if(UserManager.isUserLogged()){
                return UserManager.getUserInfo().name;
            }
            return "";
        }

        function checkActivatedAccount(){
            var param = getUrlParameterByName("activated");
            if(param != null){
                if(param == "true"){
                    Notification.info("Tu cuenta ha sido activada, por favor inicia sesión")
                }else{
                    Notification.error("Tu cuenta no pudo ser activada");
                }
            }
        }

        checkActivatedAccount();

    });