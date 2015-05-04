'use strict';

angular.module('prodapps')
	.controller('CutCtrl', function ($scope, $state, jsonRpc, prodooSync, $notification) {
	$scope.casier = [];
	$scope.sync = { data: null, current: { filter: { 'state':'draft'},  item : {sequence: 99999}}};
	var destroy = prodooSync.syncData({workcenter: $state.params.workcenter}, $scope.sync);

	$scope.prefillCasier = function (item) {
		//prefill casier array with casier comming from samed order
		$scope.sync.data.filter(function (i) {
			return i. === item.lot_number;
		}).forEach(function (item) {
			if ($scope.casier.indexOf(item.casier) === -1)
				$scope.casier.push(item.casier);
		});
	};

	$scope.print = function (item) {
		$scope.prefillCasier(item);
		console.log('print ! ', item);
		$notification('Printing...');
	};

	$scope.do = function (item) {
		$scope.print(item);
		$scope.markAsDone(item);
	};

	$scope.markAsDone = function (item) {
		jsonRpc.call('mrp.production.workcenter.line', 'prodoo_action_done', [item.id, $scope.casier.join(';')]).then(function () {
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
