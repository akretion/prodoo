'use strict';

angular.module('prodapps')
.controller('AssemblyCtrl', function ($scope, $state, jsonRpc, prodooSync, $notification, prodooPrint) {
	$scope.search = [];
	$scope.sync = { data: null, current: { filter: { 'state':'draft'}}};
	var destroy = prodooSync.syncData({workcenter: $state.params.workcenter}, $scope.sync);

	$scope.fields = ["Tube", "Tissu"];
	$scope.scans = [
		[null, null]
		,[null, null]
	];
	$scope.casier = [];
	
	$scope.$watch('sync.current.item', function () {
		$scope.casier = []; //init casier
	});
});