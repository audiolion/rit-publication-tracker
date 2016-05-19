'use strict';

angular.module('publicationTrackerApp')
	.config(function($routeProvider) {
		$routeProvider
			.when('/dashboard', {
				templateUrl: 'app/dashboard/dashboard.html',
				controller: 'DashboardController',
				controllerAs: 'dash',
				access: { restricted: false }
			});
	});