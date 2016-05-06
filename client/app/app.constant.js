(function(angular, undefined) {
'use strict';

angular.module('publicationTrackerApp.constants', [])

.constant('appConfig', {userRoles:['guest','user','faculty','admin']})

;
})(angular);