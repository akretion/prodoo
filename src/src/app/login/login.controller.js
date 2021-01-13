'use strict';

angular.module('prodapps')
.controller('LoginCtrl', ['$scope', '$state', 'jsonRpc', 'prodooConfig', '$stateParams', function ($scope, $state, jsonRpc, prodooConfig, $stateParams) {
    
    //dirty but it's ok
    angular.element('#loginPassword').trigger('focus');

    $scope.login = function (loginPassword) {
        //login and password are combined and separated by a space
        //or a token (without space) is used
        //they should be scanned
        var seperator = ' '
        
        if (loginPassword.indexOf(seperator) != -1 ) {
            var login = loginPassword.split(seperator)[0];
            var password = loginPassword.split(seperator)[1];
        } else { //token based auth
            var login = 'based_on_token';
            var password = loginPassword;
        }

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
