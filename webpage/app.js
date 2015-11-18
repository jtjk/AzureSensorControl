'use strict';

// create the module and name it scotchApp
// also include ngRoute for all our routing needs
var SensorControlApp = angular.module('SensorControlApp', ['ngRoute','sensorControllers']);

SensorControlApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/device/:deviceId', {
        templateUrl: 'device.html',
        controller: 'DevDetailRouteCtrl'
      }).
      when('/details', {
        templateUrl: 'details.html',
        controller: 'DevCtrl'
      }).
      otherwise({
        templateUrl: 'main.html',
        controller: 'DevCtrl'
      });
  }]);

