'use strict';

angular.module('prodapps')
  .controller('LoginCtrl', function ($scope,$state, jsonRpc, $cookies) {
    $scope.login = function () {
	$scope.error = "";
	jsonRpc.login('db',$scope.bucheUsername,$scope.buchePassword).then(function () {
		console.log('login succeed');
		$state.go('home');
	}, function () {
		$scope.error = "Authentication failed";
	//	$cookies.session_id='';

	});
    };
	$scope.logout = function () {
		$cookies.session_id='';
	//	jsonRpc.logout();
		$state.go('login');
};
	$scope.logout();
  })
