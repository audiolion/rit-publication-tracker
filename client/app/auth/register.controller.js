angular.module('publicationTrackerApp')
    .controller('RegisterController',
    ['$scope', '$location', 'AuthService',
        function($scope, $location, AuthService) {
            $scope.register = function() {
                $scope.error = false;
                $scope.disabled = true;

                AuthService.register($scope.loginForm.email, $scope.loginForm.fName, $scope.loginForm.lName, $scope.loginForm.password)
                    .then(function() {
                        $location.path('/');
                        $scope.disabled = false;
                        $scope.loginForm = {};
                    })
                    .catch(function() {
                        $scope.error = true;
                        $scope.errorMessage = "Email Address already in use";
                        $scope.disabled = false;
                        $scope.loginForm = {};
                    });
            };
        }]);