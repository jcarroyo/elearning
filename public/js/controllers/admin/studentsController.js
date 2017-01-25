angular.module('learningController')
    .controller('StudentsController', function($scope, AdminStudentService){

        $scope.data = {
            students: [],
            count: 0,
            currentPage: 1,
            pageSize: 10,
            pages: [],
            pagesCount: 0
        }

        function getPagination(pages){
            var p = [];
            for(var i = 0; i < pages; i++){
                p.push(i+1);
            }
            return p;
        }

        $scope.goPage = function(page){
            loadStudents(page, $scope.data.pageSize);
        }

        $scope.previousPage = function(){
            if($scope.data.currentPage > 1){
                loadStudents($scope.data.currentPage - 1);
            }
        }

        $scope.nextPage = function(){
            if($scope.data.currentPage < $scope.data.pagesCount){
                loadStudents($scope.data.currentPage + 1);
            }
        }


        function loadStudents(page){
            $scope.data.currentPage = page;
            var pageSize = $scope.data.pageSize;
            AdminStudentService.getStudentList(page, pageSize).then(
                function(result){
                    $scope.data.students = result.students;
                    $scope.data.count = result.count;
                    $scope.data.pagesCount = result.pages;
                    $scope.data.pages = getPagination(result.pages)
                },
                function(error){
                    console.log(error);
                }
            );
        }

        function init(){
            loadStudents(1);
        }

        init();

    });