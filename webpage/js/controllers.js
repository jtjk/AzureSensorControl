'use strict';

/* Controllers */

var sensorControllers = angular.module('sensorControllers', []);

sensorControllers.controller('DevCtrl', ['$scope', '$http',
  function($scope, $http) {
		$http.get('http://localhost:3000/devices').
			success(function(data,status,headers,config) {
				$scope.names = data;
			}).
			error(function(data,status,headers,config) {
				console.log("error");
			})
  }]);


sensorControllers.controller('DevDetailRouteCtrl', ['$scope', '$routeParams',
  function($scope, $routeParams) {
    console.log("Loading device page", $routeParams.deviceId)
    $scope.deviceId = $routeParams.deviceId;
  }]);

sensorControllers.controller('DevDetailFetchCtrl', ['$scope', '$http',
  function($scope, $http) {
  	    console.log("fetching data for device", $scope.deviceId)
		$http.get('http://localhost:3000/device/' + $scope.deviceId).
			success(function(data,status,headers,config) {
				$scope.device = data;
			}).
			error(function(data,status,headers,config) {
				console.log("error");
			})
  }]);
