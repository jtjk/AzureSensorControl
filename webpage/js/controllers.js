/* Controllers */
'use strict';

var host = "localhost";

var sensorControllers = angular.module('sensorControllers', []);
var ws = new WebSocket("ws://" + host + ":8080");

var timeout = 2000;
ws.onopen = function()
{
	timeout = 0;
}

sensorControllers.controller('MainCtrl', ['$scope', '$http', function($scope, $http) {
	setTimeout(function() {
		ws.send(JSON.stringify({"method": "devices"}));
	},timeout);
	ws.onmessage = function (evt)
	{
		var msg = JSON.parse(evt.data);
		if (msg.response == "deviceList") {
			$scope.$apply(function() {
				$scope.names = msg.body;
			});
		}
	};
}]);

sensorControllers.controller('DeviceCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {
	$scope.deviceId = $routeParams.deviceId;
	setTimeout(function() {
		ws.send(JSON.stringify({"method": "device", "deviceId": $scope.deviceId}));
	},timeout);
	ws.onmessage = function (evt)
	{
		var msg = JSON.parse(evt.data);
		if (msg.response == "device") {
			$scope.$apply(function() {
				$scope.device = msg.body;
			});
		}
		else {
			if (msg.body.deviceId == $scope.deviceId) {
				$scope.$apply(function() {
					$scope.windspeed = msg.body.windSpeed;
				});
			}
		}
	};
	$scope.send = function() {
		ws.send(JSON.stringify({"method": "sendmessage", "deviceId": $scope.deviceId, "message": "hello"}));
	}
}]);

