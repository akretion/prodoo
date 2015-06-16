'use strict';

angular.module('prodapps')
.controller('LoginCtrl', function ($scope,$state, jsonRpc, prodooConfig, $stateParams) {
    $scope.login = function () {
        $scope.error = "";
        jsonRpc.login(prodooConfig.db,$scope.bucheUsername,$scope.buchePassword).then(function () {
            var nextStep = $state.current.data;
            if (nextStep.state)
              $state.go(nextStep.state, nextStep.params);
            else
              $state.go('main.home');
        }, function () {
            $scope.error = "Authentication failed";
        });
    };
    $scope.logout = function () {
        console.log('logout');
        jsonRpc.logout(true);
    };
    $scope.logout();
});
