'use strict';

angular.module('prodapps')
  .controller('LoginCtrl', function ($scope,$state, jsonRpc, prodooConfig) {
    $scope.login = function () {
	$scope.error = "";
	jsonRpc.login(prodooConfig.db,$scope.bucheUsername,$scope.buchePassword).then(function () {
		console.log('login succeed');
		$state.go('home.main');
	}, function () {
		$scope.error = "Authentication failed";
	});
    };
	$scope.logout = function () {
		console.log('logout');
		jsonRpc.logout();
		$state.go('login');
	};
	$scope.logout();
  })
