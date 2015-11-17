(function() {
	// create the module and name it scotchApp
        // also include ngRoute for all our routing needs
    var SensorControlApp = angular.module('SensorControlApp', ['ngRoute']);

    // configure our routes
    SensorControlApp.config(function($routeProvider, $locationProvider) {
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : 'main.html',
                controller  : 'DevCtrl'
            })

            // route for the about page
            .when('/device', {
                templateUrl : 'devices.html',
                controller  : 'DevCtrl'
            });

              // use the HTML5 History API
        $locationProvider.html5Mode(true);
    });



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