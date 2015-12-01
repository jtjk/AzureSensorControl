/* Controllers */
'use strict';

var host = "localhost";

// open websocket to listen for messages
var ws = new WebSocket("ws://" + host + ":8080");

ws.onopen = function()
{
	ws.send("Message to send");
	console.log("sent ws messge just because we can");
};

var sensorControllers = angular.module('sensorControllers', []);

sensorControllers.controller('DevCtrl', ['$scope', '$http',
  function($scope, $http) {
		$http.get('http://' + host + ':3000/devices').
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
  	  	$scope.send = function() {

    		$scope.msg = 'clicked';
			$http.get('http://' + host + ':3000/sendmessage/' + $scope.deviceId + "?msg=hello").
				success(function(data,status,headers,config) {
					$scope.device = data;
				}).
				error(function(data,status,headers,config) {
					console.log("error");
				})

  		}
  	    console.log("fetching data for device", $scope.deviceId)
		$http.get('http://' + host + ':3000/device/' + $scope.deviceId).
			success(function(data,status,headers,config) {
				$scope.device = data;
			}).
			error(function(data,status,headers,config) {
				console.log("error");
			})
  }]);

sensorControllers.controller('WindspeedCtrl', ['$scope', '$http','$timeout',
  function($scope, $http, $timeout) {
	ws.onmessage = function (evt)
	{
		var received_msg = JSON.parse(evt.data);
		if (received_msg.deviceId == $scope.deviceId) {
			$scope.$apply(function() {
				$scope.windspeed = received_msg.windSpeed;
			});
		}
		console.log(received_msg);
	};
  }]);
