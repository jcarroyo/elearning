angular.module('learningController')
    .controller('StudentProfileController', function($scope, StudentAccountService, Notification){
        $scope.account = {
            user: '',
            email: ''
        };
        $scope.courses = [];
        $scope.changePassword = {
            current: '',
            new: '',
            newRepeat: ''
        };
        $scope.updateUserProfile = function(){
            var updateUser = {
                name: $scope.account.user
            }
            StudentAccountService.updateStudentProfile(updateUser).then(
                function(result){
                    Notification.success("Tus datos han sido actualizados")
                }
            );
        }
        $scope.changePassword = function(){
            if($scope.changePassword.current && $scope.changePassword.new && $scope.changePassword.newRepeat &&
                $scope.changePassword.new == $scope.changePassword.newRepeat){
                StudentAccountService.changeStudentPassword($scope.changePassword.current, $scope.changePassword.new).then(
                    function(result){
                        Notification.success("Tu contraseña fue actualizada");
                        $scope.changePassword.current = "";
                        $scope.changePassword.new = "";
                        $scope.changePassword.newRepeat = "";
                    }
                );
            }
        }
        function loadStudentProfile(){
            StudentAccountService.getStudentProfile().then(
                function(profile){
                    $scope.account.user = profile.name;
                    $scope.account.email = profile.email;
                }
            );
        }

        function loadStudentCourses(){
            StudentAccountService.getStudentCourses().then(
                function(courses){
                    $scope.courses = courses;
                }
            );
        }
        function init(){
            loadStudentProfile();
            loadStudentCourses();
        }
        init();
    });