angular.module('learningApp').
    filter('studentStatusName', function(){
        return function(statusID){
            if(statusID == 1){
                return "active";
            }
            if(statusID == 2){
                return "lock";
            }
            if(statusID == 3){
                return "pendingToActivate"
            }
            return "?";
        }
    });