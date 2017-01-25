angular.module('learningController').
    controller('CourseContentController', function($rootScope, $scope, AdminCoursesService, Notification){

        function notifyChange(){
            $rootScope.$broadcast('lessons-changed');
        }

        var courseID = "";
        $scope.course = {
            title: ''
        }
        $scope.sections = [];
        $scope.editionActive = false;
        $scope.content = {
            selectedType: 'section',
            title: '',
            selectedSection: '',
            token: ''
        };

        $scope.addContent = function(type){
            if(type == "section"){
                addSection();
            }
            if(type == "lesson"){
                addLesson();
            }
        };

        $scope.cancelEdit = function(){
            $scope.editionActive = false;
            $scope.content.title = "";
        }

        $scope.$watch('content.selectedType', function(newValue, oldValue){
            if(newValue != oldValue){
                if(newValue == "lesson" && $scope.sections.length == 0){
                    alert("Primero deber agregar una nueva sección");
                    $scope.content.selectedType = "section";
                    return;
                }
                if(newValue == "lesson"){
                    $scope.content.selectedSection = $scope.sections[0].title;
                }
            }
        });

        $scope.updateContent = function(type){

        }

        function addSection(){
            var title = $scope.content.title;
            var order = $scope.sections.length + 1;
            $scope.sections.push({
                title: title,
                order: order,
                lessons: []
            });
            $scope.content.title = '';

            AdminCoursesService.addCourseContentSection(courseID, {
               title: title,
                order: order
            }).then(function(result){
                loadCourseContentInfo();
            },function(error){
               console.log(error);
            });
        };

        $scope.editSection = function(section){
            $scope.editionActive = true;
            $scope.content.selectedType = 'section';
            $scope.content.title = section.title;
        }

        $scope.editLesson = function(lesson){
            $scope.editionActive = true;
        }

        $scope.removeSection = function(section){
            var index = $scope.sections.indexOf(section);
            if(index > -1){
                $scope.sections.splice(index, 1);
                console.log("removed section", section);
            }
        }

        $scope.removeLesson = function(section, lesson){
            console.log(courseID,section._id, lesson._id);
            AdminCoursesService.removeCourseContentLesson(courseID, section._id, lesson._id).then(function(result){
                loadCourseContentInfo();
            },function(error){
                console.log(error);
            })
        }

        function addLesson(){
            var title = $scope.content.title;
            var section = $scope.content.selectedSection;
            var lesson = {
                title: title,
                order: section.lessons.length + 1
            };
            AdminCoursesService.addCourseContentLesson(courseID, section._id, lesson)
                .then(function(lessonID){
                    Notification({message: "Por favor espere mientras se sube el video", delay: 30000});
                    AdminCoursesService.getUploadVideoToken(courseID, section._id, lessonID).then(function(data){
                        $scope.content.token = data.token;
                        //submit!
                        setTimeout(function(){
                            $('#formContent').submit();
                        }, 500);
                    });
                },function(error){
                    console.log(error);
                });
        };

        function loadCourseContentInfo(){
            AdminCoursesService.getCourseContentInfoByID(courseID)
                .then(function(course){
                    console.log(course);
                    $scope.course.title = course.title;
                    $scope.sections = course.sections;
                    notifyChange();
                },function(error){
                    console.log(error);
                });
        }

        function init(){
            courseID = getUrlParameterByName("courseID");
            loadCourseContentInfo();
        }
        init();
    });