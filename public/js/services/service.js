var host = location.origin;

angular.module('learningService', [])
.constant('serviceConstants', {
    hostURL: host
});
