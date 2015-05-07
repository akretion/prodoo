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
		//if item.components is [ {name: 'tissu'}, { name:'profile'}]
		// and item.qty = 2 
		// then scans whould be [ [null, null], [null, null]]
		// (Array.prototype.fill() is not ready yet / polyfill instead : 
		var line = [], k = 0;
		for (k = 0; k < newVal.components.length; k++)
			line.push(null);

		for (k = 0; k < newVal.qty; k++)
			$scope.scans.push(line)

	});

	$scope.$on('$destroy', destroy);

});
