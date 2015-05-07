'use strict';

angular.module('prodapps')
	.controller('CutCtrl', function ($scope, $state, jsonRpc, prodooSync, $notification, prodooPrint) {
	$scope.casier = [];
	$scope.sync = { data: null, current: { filter: { 'state':'!done'}}};
	var destroy = prodooSync.syncData({workcenter: $state.params.workcenter}, $scope.sync);
	$scope.prefillCasier = function (item) {
		//prefill casier array with casier comming from samed order
		$scope.rack = angular.copy($scope.sync.current.item.rack); //angular.copy protects from cycles
		$scope.sync.data.filter(function (i) {
			return i.lot_number === item.lot_number;
		}).forEach(function (item) {
			if ($scope.rack.indexOf(item.rack) === -1)
				$scope.rack.push(item.rack);
		});
	};

	$scope.print = function (item, qte) {
		$notification('Printing...');
		prodooPrint(item, qte);
	};

	$scope.do = function (item) {
		$scope.prefillCasier(item);
	};

	$scope.markAsDone = function (item) {
		jsonRpc.call('mrp.production.workcenter.line', 'prodoo_action_done', [item.id, $scope.rack.join(';')]).then(function () {
			item.state = 'done';
			$notification('Done');
		}, function () {
			$notification('an error has occured');
		});
	};

	$scope.$on('$destroy', function() {
		destroy();
	});
});
