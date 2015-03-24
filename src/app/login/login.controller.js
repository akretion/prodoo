'use strict';

angular.module('prodapps')
  .controller('LoginCtrl', function ($scope,$state, jsonRpc) {
    $scope.login = function () {
	$scope.error = "";
	jsonRpc.login('db',$scope.bucheUsername,$scope.buchePassword).then(function () {
		console.log('login succeed');
		$state.go('home');
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
