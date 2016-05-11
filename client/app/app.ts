'use strict';

angular.module('publicationTrackerApp', [
  'publicationTrackerApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'btford.socket-io',
  'ui.bootstrap'
])
  .config(function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/',{
        access: { restricted: true }
      })
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  });
  
