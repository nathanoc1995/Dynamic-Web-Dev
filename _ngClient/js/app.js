var nathansTakeaway = angular.module("nathansTakeaway", ['ngRoute', 'nrzLightify','menuController', 'ngResource' ]);

nathansTakeaway.run(function( ) {

});

nathansTakeaway.config(['$routeProvider','$httpProvider', '$provide',  '$locationProvider',
      function($routeProvider, $httpProvider, $provide,  $locationProvider ) {	 
	  
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];	  
 
			$routeProvider.
					when('/menu',{
						templateUrl: './partials/menu.html',
						controller: 'MenuCtrl'
						}).						
					  otherwise({
						redirectTo: '/menu'
					  });
 			
  }]);