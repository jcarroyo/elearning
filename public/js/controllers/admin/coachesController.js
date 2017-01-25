angular.module('learningController')
    .controller('CoachesController', function($scope, AdminCoachService, Notification){

        $scope.coaches = [];

        $scope.removeCoach = function(coachID){
            AdminCoachService.removeCoach(coachID).then(
                function(result){
                    Notification.success("Instructor eliminado")
                    loadCoaches();
                },
                function(error){
                    Notification.error(error);
                }
            )
        }

        function loadCoaches(){
            AdminCoachService.getCoaches().then(
                function(coaches){
                    $scope.coaches = coaches;
                },
                function(error){
                    Notification.error("Sucedió un error");
                }
            );
        }
        function init(){
            loadCoaches();
        }
        init();
    });