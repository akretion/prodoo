'use strict';

angular.module('prodapps', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ui.router', 'mgcrea.ngStrap','buche', 'odoo', 'notification', 'ionic'])
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
        })
        .state('main.cut', {
            url: '/cut/{workcenter:int}',
            templateUrl: 'app/cut/cut.html',
            controller: 'CutCtrl'
        })
        .state('main.strip_cut', {
            url: '/stripCut/{workcenter:int}',
            templateUrl: 'app/cut/cut.html',
            controller: 'CutCtrl'
        })
        .state('main.assembly', {
            url:'/assembly/{workcenter:int}',
            templateUrl: 'app/assembly/assembly.html',
            controller:'AssemblyCtrl'
        })
        .state('main.venetian_assembly', {
            url:'/venetianAssembly/{workcenter:int}',
            templateUrl: 'app/venetianAssembly/venetianAssembly.html',
            controller:'VenetianAssemblyCtrl'
        })
        .state('main.trolley_assembly', {
            url:'/trolleyAssembly/{workcenter:int}',
            templateUrl: 'app/trolleyAssembly/trolleyAssembly.html',
            controller:'TrolleyAssemblyCtrl'
        });

    $urlRouterProvider.otherwise('/');

    jsonRpcProvider.odooRpc.odoo_server = prodooConfigProvider.config.odooServer;
})
.run(function ($rootScope, $state, jsonRpc, prodooConfig, $notification) {
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
        jsonRpc.errorInterceptors.push(function (e) {
            console.log('Error with webservice: ', e);
            if (e.title =='session_expired')
              $state.go('login');
            else
              $notification('Webservice error: ' + e.title);
        });
    });
});
