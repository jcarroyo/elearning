angular.module('learningController')
    .controller('CourseImagesController', function($scope){
        $scope.course ={
            _id: 0
        };
        function init(){
            var courseID = getUrlParameterByName("courseID");
            if(courseID) {
                $scope.course._id = courseID;
            }
        }
        init();
    });