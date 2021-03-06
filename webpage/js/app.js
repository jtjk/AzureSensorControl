'use strict';

// create the module and name it scotchApp
// also include ngRoute for all our routing needs
var SensorControlApp = angular.module('SensorControlApp', ['ngRoute','sensorControllers']);

SensorControlApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
	when('/device/:deviceId', {
            templateUrl: 'partials/device.html',
            controller: 'DeviceCtrl'
	}).
	otherwise({
            templateUrl: 'partials/main.html',
            controller: 'MainCtrl'
	});
}]);

