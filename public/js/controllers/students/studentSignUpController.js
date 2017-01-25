angular.module('learningController')
.controller('StudentSignUpController', function($scope, StudentAccountService, Notification){
    $scope.account = {};
    $scope.createActive = true;

    $scope.createAccount = function(){
        var valid = validateAccount($scope.account);
        if(valid == true){
            var data = {
                name: $scope.account.user,
                password: $scope.account.password,
                email: $scope.account.email
            };
            StudentAccountService.createAccount(data).then(
                function(result){
                    Notification.success("Tu cuenta ha sido creada, por favor ingresa a tu correo para activar tu cuenta");
                    $scope.account = {};
                    $scope.createActive = false;
                }
            );
        }else{
            Notification.error(valid);
        }
    }

    function validateAccount(account){
        if(account.password != account.passwordRepeat){
            return "Las contraseñas deben ser iguales"
        }
        return true;
    }

});