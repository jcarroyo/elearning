angular.module('learningController')
    .controller('CourseController', function($scope, $q, CourseService, $window){
        $scope.course = {
            _id: '',
            title: '',
            description: '',
            sections: [],
            payed: false
        };
        var friendlyUrlName = $('#friendlyUrlName').val();
        $scope.coach = {
            name: '',
            bio: '',
            imageUrl: ''
        };
        CourseService.getCourseByFriendlyName(friendlyUrlName).then(
            function(result){
                $scope.course = result.course;
                $scope.coach = result.coach;
            }
        );
        $scope.buy = function(courseID){
            CourseService.buyCourse(courseID).then(
                function (url) {
                    $window.location.href = url;
                }
            );
        }
});