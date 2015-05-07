'use strict';

angular.module('prodapps')
.controller('AssemblyCtrl', function ($scope, $state, jsonRpc, prodooSync, $notification, prodooPrint) {
	$scope.sync = { data: null, current: { filter: { 'state':'draft'}}};
	var destroy = prodooSync.syncData({workcenter: $state.params.workcenter}, $scope.sync);
	$scope.fields = [];
	$scope.scans = [];
	$scope.casier = [];
	
	$scope.$watch('sync.current.item', function (newVal) {
		if (!newVal)
			return;
		$scope.casier = []; //init casier

		$scope.fields = newVal.components;
		$scope.scans = [];
		var line = [], k = 0;
		for (k = 0; k < newVal.components.length; k++)
			line.push(null);

		for (k = 0; k < newVal.qty; k++)
			$scope.scans.push(line)

	});
});