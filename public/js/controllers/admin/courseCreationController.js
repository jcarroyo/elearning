angular.module('learningController')
    .controller('CourseCreationController', function($scope, $q, AdminCoursesService, AdminCoachService, Notification, $window){
        var t = "<p style='color: rgb(85, 85, 85);background-color: rgb(255, 255, 255);'><b>¿Cuáles son los requisitos?</b><br/><br/></p><p style='color: rgb(85, 85, 85);background-color: rgb(255, 255, 255);'><b>¿Qué voy a aprender en este curso?</b><br/><b><br/></b></p><p style='color: rgb(85, 85, 85);background-color: rgb(255, 255, 255);'><b>¿A quién está dirigido?</b><br/></p><!--EndFragment--><p><br/></p>";

        $scope.course = {
            _id: 0,
            title: '',
            friendlyUrlName: '',
            category: '',
            description: t,
            currency: '',
            price: '',
            shortDescription: '',
            tags: '',
            fakeCounter: 0,
            coachID: 0
        };

        $scope.bind = {
            currencies: null,
            categories: [],
            coaches: []
        };


        var promises = {
            "coaches": AdminCoachService.getCoachesLookUp(),
            "categories": AdminCoursesService.getCourseCategories(),
            "currency": AdminCoursesService.getCurrencyList()
        }

        $scope.save = function(){
            AdminCoursesService.createCourseDescription($scope.course).then(
                function (result) {
                    Notification.info("Se creó el curso");
                    var q = "?" + "courseID=" + result._id;
                    $window.location.href = "/admin/create-course-content" + q;
                }
            );
        }

        $scope.update = function(){
            AdminCoursesService.updateCourseDescription($scope.course._id, $scope.course).then(
                function(result){
                    $window.location.href = "/admin/courses";
                }
            );
        }

        function bindCoaches(coaches){
            $scope.bind.coaches = coaches;
        }

        function bindCategories(categories){
            $scope.bind.categories = categories;
        }

        function bindCurrency(currencies){
            $scope.bind.currencies = currencies;
        }

        function loadCourse(){
            AdminCoursesService.getCourseDescriptionByID($scope.course._id).then(
                function(data){
                    $scope.course = data;
                }
            );
        }

        function init(){
            var courseID = getUrlParameterByName("courseID");
            $q.all(promises).then(function(data){
                bindCoaches(data.coaches);
                bindCategories(data.categories.data);
                bindCurrency(data.currency);
                if(courseID){
                    $scope.course._id = courseID;
                    loadCourse();
                }
            });
        }
        init();
    });