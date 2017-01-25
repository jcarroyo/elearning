angular.module('learningController')
    .controller('CatalogController', function($scope, $q, CatalogService){
        $scope.catalog = {
            categories: [],
            courses: [],
            promos: []
        };
        $scope.categoryChange = function(category){
            populateCourses(category);
        };
        CatalogService.getCategories().then(function(response){
            $scope.catalog.categories = response.data;
        });
        function populateCourses(category){
            CatalogService.getCourses(category).then(function(response){
                $scope.catalog.courses = response.data;
            });
        }
        function init(){
            populateCourses(null);
        }
        init();
});