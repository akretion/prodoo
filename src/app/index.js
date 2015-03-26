'use strict';

angular.module('prodapps', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ui.router', 'mgcrea.ngStrap','buche', 'odoo'])
  .config(function ($stateProvider, $urlRouterProvider, jsonRpcProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/mmain.html',
        controller: 'MainCtrl'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'app/login/login.html',
        controller: 'LoginCtrl'
	});
    $stateProvider.state('cut', {
        url: '/cut/{workcenter:int}',
        templateUrl: 'app/cut/cut.html',
        controller: 'CutCtrl'
    });

   $urlRouterProvider.otherwise('/');

   if (prodoo.server)
     jsonRpcProvider.odooRpc.odoo_server = prodoo.server;
   jsonRpcProvider.odooRpc.interceptors.push(function (a) { console.log('Et BIM !!!', a);});

	})
.run(function ($rootScope, $state, jsonRpc) {
	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
		if (toState.name === 'login')
			return;

		if (!jsonRpc.isLoggedIn()) {
			console.log('not logged in');
			event.preventDefault();
			$state.go('login');
		}
	}); 

  })
;
