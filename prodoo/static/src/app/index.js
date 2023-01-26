'use strict';

angular.module('prodapps', ['ngAnimate', 'ngSanitize', 'ui.router', 'mgcrea.ngStrap', 'odoo', 'notification', 'ionic'])
.config(function ($stateProvider, $urlRouterProvider, jsonRpcProvider, prodooConfigProvider) {
    $stateProvider
        .state('main', {
            templateUrl: 'app/main/main.html',
            resolve: {
                'apps': 'apps'
            }
        })
        .state('main.home', {
            url: '/',
            templateUrl: 'app/main/home.html',
            controller: 'MainCtrl',
            resolve: {
                'apps': 'apps'
            }
        })
        .state('login', {
            url: '/login',
            templateUrl: 'app/login/login.html',
            controller: 'LoginCtrl',
            data: {}
        })
        .state('main.assembly', {
            url:'/assembly/{workcenter:int}',
            views: {
                '': {
                    templateUrl: 'app/assembly/assembly.html',
                    controller:'AssemblyCtrl',                    
                },
                'orderList@main.assembly': { 
                    controller: 'OrderListCtrl',
                    templateUrl: 'app/assembly/orderList.html'
                }
            }
        })
        .state('main.replenish', {
            url: '/replenish/{workcenter:int}',
            templateUrl: 'app/replenish/replenish.html',
            controller: 'ReplenishCtrl',
            resolve: {
                'apps': 'apps',
            }
        })
        .state('main.configuration', {
            url: '/configuration',
            templateUrl: 'app/configuration/configuration.html',
            controller: 'ConfigurationCtrl',
            resolve: {
                'apps': 'apps'
            }
        })
        .state('main.tdcp', {
            url: '/tdcp/{workcenter:int}',
            templateUrl: 'app/tdcp/tdcp.html',
            controller: 'TdcpCtrl',
            resolve: {
                'apps': 'apps'
            }
        })
        ;

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
            //keep in memory desired app/workcenter
            //in order to redirect after login
            $state.get('login').data.params = toParams;
            $state.get('login').data.state = toState.name;
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
