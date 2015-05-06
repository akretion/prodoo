'use strict';

angular.module('prodapps', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ui.router', 'mgcrea.ngStrap','buche', 'odoo', 'notification'])
.config(function ($stateProvider, $urlRouterProvider, jsonRpcProvider, prodooConfigProvider) {
	$stateProvider
		.state('main', {
			templateUrl: 'app/main/main.html'
		})
		.state('main.home', {
			url: '/',
			templateUrl: 'app/main/home.html',
			controller: 'MainCtrl'
		})
		.state('login', {
			url: '/login',
			templateUrl: 'app/login/login.html',
			controller: 'LoginCtrl'
	});
	$stateProvider.state('main.cut', {
			url: '/cut/{workcenter:int}',
			templateUrl: 'app/cut/cut.html',
			controller: 'CutCtrl'
	});

	$stateProvider.state('main.strip_cut', {
			url: '/stripCut/{workcenter:int}',
			templateUrl: 'app/stripCut/stripCut.html',
			controller: 'StripCutCtrl'
	});
	$stateProvider.state('main.assembly', {
		url:'/assembly/{workcenter:int}',
			templateUrl: 'app/assembly/assembly.html',
			controller:'AssemblyCtrl'
	});
	$stateProvider.state('main.venetian_assembly', {
		url:'/venetianAssembly/{workcenter:int}',
			templateUrl: 'app/venetianAssembly/venetianAssembly.html',
			controller:'VenetianAssemblyCtrl'
	});
	$stateProvider.state('main.trolley_assembly', {
		url:'/trolleyAssembly/{workcenter:int}',
			templateUrl: 'app/trolleyAssembly/trolleyAssembly.html',
			controller:'TrolleyAssemblyCtrl'
	});

	$urlRouterProvider.otherwise('/');

	// jsonRpcProvider.odooRpc.odoo_server = prodooConfigProvider.config.odooServer;
	jsonRpcProvider.odooRpc.errorInterceptors.push(function (a) { console.log('Et BIM !!!', a);});

})
.run(function ($rootScope, $state, jsonRpc, prodooConfig) {
	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
		if (toState.name === 'login')
			return;

		if (!jsonRpc.isLoggedIn()) {
			console.log('not logged in');
			event.preventDefault();
			$state.go('login');
		}
		//modal workaround for bootstrap
		angular.element('body').on('shown.bs.modal', function (e) {
			angular.element(e.currentTarget).find('[autofocus]').focus();
		});
	}); 
});
