(function() {
	angular.module('SensorControlApp', []).controller('DevCtrl', function($scope, $http) {
		$http.get('http://localhost:3000/devices').
			success(function(data,status,headers,config) {
				$scope.names = data;
			}).
			error(function(data,status,headers,config) {
				console.log("error");
			})
/*
	    $scope.names = [
	        {name:'Jani',country:'Norway'},
	        {name:'Hege',country:'Sweden'},
	        {name:'Kai',country:'Denmark'}
	    ];
*/	    
	});
})();