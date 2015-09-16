'use strict';

angular.module('prodapps')
.controller('LoginCtrl', ['$scope', '$state', 'jsonRpc', 'prodooConfig', '$stateParams', function ($scope, $state, jsonRpc, prodooConfig, $stateParams) {
    
    //dirty but it's ok
    angular.element('#loginPassword').trigger('focus');

    $scope.login = function (loginPassword) {
        //login and password are combined and separated by a space
        //they should be scanned
        var login = loginPassword.split(' ')[0];
        var password = loginPassword.split(' ')[1];

        $scope.error = "Loading...";
        jsonRpc.login(prodooConfig.db,login,password).then(function () {
            var nextStep = $state.current.data;
            $scope.error = "Ok";
            if (nextStep.state)
              $state.go(nextStep.state, nextStep.params);
            else
              $state.go('main.home');
        }, function () {
            $scope.error = "Authentication failed for " + login;
        });
    };
    $scope.logout = function () {
        console.log('logout');
        jsonRpc.logout(true);
    };
    $scope.logout();
}]);
