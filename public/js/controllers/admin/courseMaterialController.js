angular.module('learningController')
    .controller('CourseMaterialController', function($scope, AdminCoursesService){

        $scope.$on('lessons-changed', function(event, args){
           init();
        });

        function init(){
            var courseID = getUrlParameterByName("courseID");
        }
    });