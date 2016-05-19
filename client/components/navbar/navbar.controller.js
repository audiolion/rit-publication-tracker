angular.module('publicationTrackerApp')
    .controller('NavbarController',
    ['$scope', '$location', 'AuthService',
        function($scope, $location, AuthService) {
        	$scope.hello = "hello";
        	$scope.user = function() {
        		AuthService.getUserName();
        	}
        	$scope.isLoggedIn = function() {
        		AuthService.isLoggedIn();
        	}
        }]);