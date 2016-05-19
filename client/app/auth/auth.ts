'use strict';

angular.module('publicationTrackerApp')
	.config(function($routeProvider) {
		$routeProvider
			.when('/', {
				title: 'Home',
				access: {restricted: false}
			})
			.when('/login', {
				title: 'Login',
				templateUrl: 'app/auth/login.html',
				controller: 'LoginController',
				access: {restricted: false}
			})
			.when('/logout', {
				title: 'Logout',
				templateUrl: 'auth/logout.html',
				controller: 'LogoutController',
				access: {restricted: true}
			})
			.when('/register', {
				title: 'Register',
				templateUrl: 'auth/register.html',
				controller: 'AuthController',
				access: {restricted: false}
			})
			.when('/dashboard', {
				title: 'Dashboard',
				templateUrl: 'auth/dashboard.html',
				controller: 'AuthController',
				access: {restricted: true}
			});
	})
	.run(function($rootScope, $location, $route, AuthService) {
		$rootScope.$on("$routeChangeStart", function(event, next, current) {
			AuthService.getUserStatus().then(function() {
				console.log(next);
				if (next.access.restricted && !AuthService.isLoggedIn()) {
					$location.path('/login');
					$route.reload();
				}
			});
		});
	});