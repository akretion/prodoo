'use strict';

angular.module('prodapps')
	.controller('StripCutCtrl', function ($scope, $state, jsonRpc, prodooSync, $notification) {
	$scope.sync = { data: null, current: { filter: { 'state':'draft'},  item : {sequence: 99999}}};
	var destroy = prodooSync.syncData({workcenter: $state.params.workcenter}, $scope.sync);

	$scope.print = function (item) {
		console.log('print ! ', item);
		$notification('Printing...');
	};

	$scope.do = function (item, modale) {
		$scope.print(item);
		$scope.markAsDone(item, modale);
	}

	$scope.markAsDone = function (item, modale) {
		var casier = null;
		if (modale && modale.casier)
			casier = modale.casier;

			jsonRpc.call('mrp.production.workcenter.line', 'prodoo_action_done', [item.id, casier]).then(function () {
			if (casier)
				modale.casier = "";
			item.state = 'done';
			$notification('Done');

			$scope.updateSalesDone();
		}, function () {
			$notification('an error has occured');
		});
	};

	$scope.$watch('sync.data', function () {
		$scope.updateSalesDone();
	});

	$scope.updateSalesDone = function () {
		$scope.salesDone = [];

		var draft = $scope.sync.data.filter(function(e) {
			return e.state === 'draft';
		}).map(function (e) {
			return e.sale_name;
		});

		$scope.salesDone = $scope.sync.data.filter(function (e) {
			return draft.indexOf(e.sale_name) === -1;
		});
		console.log(draft, $scope.salesDone);
	};


	$scope.$on('$destroy', function() {
		destroy();
	});
});