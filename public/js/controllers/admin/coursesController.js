angular.module('learningController')
    .controller('CoursesController', function($scope, AdminCoursesService, $window){
        $scope.selectedCategory = '';
        $scope.data = {
            courses: [],
            categories: []
        };
        AdminCoursesService.getCourseCategories().then(function(data){
            $scope.data.categories = data;
        },function(error){
            console.log(error);
        });

        function loadCoursesByCategory(category){
            AdminCoursesService.getCourses(category).then(function(data){
                $scope.data.courses = data;
            },function(error){
                console.log(error);
            });
        }

        $scope.$watch('selectedCategory', function(newValue, oldValue){
            if(newValue != oldValue){
                loadCoursesByCategory(newValue);
            }
        });

        $scope.changeStatus = function(course){
            var newStatus = course.status == "draft"? "published" : "draft";
            AdminCoursesService.changeCourseStatus(course._id, newStatus).
                then(function(result){
                    course.status = newStatus;
                },function(error){
                    console.log(error);
                });
        }

        loadCoursesByCategory($scope.selectedCategory);

    });