angular.module('learningController')
    .controller('CourseLessonController', function($scope, $q, CourseService, $sce){
        var friendlyUrlName, lessonID;
        $scope.course = {
            sections: [],
            video: null,
            videoFrame: ''
        }
        function load(){
            var promises = {
                courseInfo: CourseService.getCourseLessonsByFriendlyUrlName(friendlyUrlName)
            };
            $q.all(promises).then(function(result){
                $scope.course = {
                    sections: result.courseInfo.sections
                }
                result.courseInfo.sections.forEach(function(section){
                   section.lessons.forEach(function(lesson){
                      if(lesson._id == lessonID){
                          $scope.course.video = lesson;
                          $scope.course.videoFrame = $sce.trustAsHtml(lesson.embedCode);
                      }
                   });
                });
            },function(error){
                console.log(error);
            });
        }
        function extractParamsFromUrl(){
            var url = location.href;
            friendlyUrlName = url.match(/course\/(.*)\/lesson/)[1];
            lessonID = url.match(/lesson\/(\w+)/)[1];
        }
        function init(){
            extractParamsFromUrl();
            load();
        }
        init();
    });