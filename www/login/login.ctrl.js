'use strict';

angular.module('starter').controller('LoginCtrl', ['$scope', 'jsonRpc', '$state', function ($scope, jsonRpc, $state) {
    $scope.login = {
        'db': 'db',
        'username':'admin'
    };

	$scope.submit = function () {
        $scope.errorMessage = null;
		jsonRpc.login(
            $scope.login.db,
            $scope.login.username,
            $scope.login.password
        ).then(function (a) {
			$state.go('list');
		}, function(e) {
			$scope.errorMessage = e.message;
		});
	}
}]);