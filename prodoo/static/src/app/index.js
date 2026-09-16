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
        .state('main.activity', {
            url: '/activity',
            templateUrl: 'app/activity/activity.html',
            controller: 'ActivityCtrl',
            resolve: {
                'apps': 'apps'
            }
        })        
        ;

    $urlRouterProvider.otherwise('/');

    jsonRpcProvider.odooRpc.odoo_server = prodooConfigProvider.config.odooServer;
})
.run(function ($rootScope, $state, jsonRpc, prodooConfig, $notification) {

    //error titles which mean that the request could not be linked to a valid
    //user session (see the error handling in odoo.js). The prodoo session is
    //the Odoo one: it may be closed from another browser or by the automatic
    //logout (user_automatic_logout_custom). In that case every call to Odoo
    //fails and the screen simply keeps its old data, so we go back to the
    //login page as soon as we detect it.
    function isSessionOver(e) {
        return !!(e && ['SessionExpired', 'Not Logged', 'page_not_found'].indexOf(e.title) !== -1);
    }

    //registered only once: doing it in the $stateChangeStart handler below
    //would add the same interceptor again at every state change
    jsonRpc.errorInterceptors.push(function (e) {
        console.log('Error with webservice: ', e);
        if (isSessionOver(e)) {
            if ($state.current.name !== 'login')
                $state.go('login');
        } else {
            //other errors have nothing to do with the session
            //(UserError, server unreachable...): just warn the user, as before
            $notification('Webservice error: ' + e.title);
        }
    });

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        if (toState.name === 'login')
            return;
        //jsonRpc.isLoggedIn();

        //modal workaround for bootstrap
        angular.element('body').on('shown.bs.modal', function (e) {
            angular.element(e.currentTarget).find('[autofocus]').focus();
        });
    });
});
