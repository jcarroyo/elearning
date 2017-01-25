angular.module('learningController')
    .controller('CoachController', function($scope, AdminCoachService, Notification){

        $scope.coach = {
            _id: null,
            name: '',
            bio: '',
            image:{
                url: null,
                id: null
            }
        };

        $scope.save = function(){
            AdminCoachService.saveCoach($scope.coach).then(
                function(result){
                    $scope.coach._id = result._id;
                    Notification.success("Se guardaron los cambios")
                },
                function(error){
                    Notification.error("Sucedió un error");
                }
            );
        }

        $scope.update = function(){
            AdminCoachService.updateCoach($scope.coach).then(
                function(result){
                    Notification.success("Se actualizaron los cambios")
                },
                function(error){
                    Notification.error("Sucedió un error");
                }
            );
        }

        function loadCoachByID(id){
            AdminCoachService.getCoachByID(id).then(
                function(result){
                    if(result == null){
                        Notification.warning("No existe el instructor")
                    }else{
                        $scope.coach = result;
                    }
                },
                function(error){
                    Notification.error("Sucedió un error");
                }
            )
        }

        function init(){
            var coachID = getUrlParameterByName("coachID");
            if(coachID != null){
                $scope.coach._id = coachID;
                loadCoachByID(coachID);
            }
        }

        init();
    });