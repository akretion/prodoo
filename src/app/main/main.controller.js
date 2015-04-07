'use strict';

angular.module('prodapps')
  .controller('MainCtrl', function ($scope, $state, jsonRpc) {
	
	$scope.$state = $state;
	$scope.workcenters = null;
	$scope.groups = {};
	jsonRpc.call('mrp.workcenter', 'prodoo_get_workcenter', []).then(function (data) {
		console.log('data loaded', data);
		$scope.workcenters = data;
		$scope.workcenters.forEach(function (w) {
			if (!$scope.groups[w.group])
				$scope.groups[w.group] = [];
			$scope.groups[w.group].push(w);	
		});
	});


});
