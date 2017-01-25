angular.module('learningController')
    .controller('LogController', function($scope, AdminLogService){
        $scope.logData = {
            currentPage: 1,
            data: [],
            count: 0,
            pages: 0
        }
        $scope.level = 'info';

        $scope.previousPage = function(){
            if($scope.currentPage > 1){
                populateLogs($scope.logData.currentPage - 1, $scope.level);
            }
        }

        $scope.goPage = function(page){
            populateLogs(page);
        }

        $scope.nextPage = function(){
            if($scope.logData.currentPage < $scope.logData.pages){
                populateLogs($scope.logData.currentPage + 1, $scope.level);
            }
        }

        $scope.$watch('filter.level', function(newValue, oldValue){
            if(newValue != oldValue){
                populateLogs($scope.logData.currentPage, newValue);
            }
        })

        function populateLogs(page, level){
            $scope.currentPage = page;
            AdminLogService.getLogs(level, page).then(
                function(result){
                    $scope.logData = result;
                }
            )
        }
        function init(){
            populateLogs($scope.logData.currentPage, $scope.level);
        }
        init();
    });