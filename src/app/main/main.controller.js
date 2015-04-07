'use strict';

angular.module('prodapps')
  .controller('MainCtrl', function ($scope, $state, jsonRpc) {
	
	$scope.$state = $state;
	jsonRpc.call('mrp.workcenter', 'prodoo_get_workcenter', []).then(function (data) {
		console.log('data loaded', data);
		$scope.workcenters = data;
	});


});
